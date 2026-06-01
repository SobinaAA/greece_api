import { strict as assert } from "assert";
import { DataGenerator } from "../src/helpers/data.generator";
import {
  Configuration,
  EntitiesApi,
  MythologyEntity,
  MythologyEntityCategoryEnum,
  MythologyGetCategoryEnum,
} from "../src/clients";
import { EntitiesService } from "../src/services/entitles.service";
import { prepareToken } from "../src/helpers/login";
import {
  correctPatchTest,
  correctSearch,
  createCorrectEntitie,
  createIncorrectEntitie,
  incorrectID,
  incorrectSearch,
} from "./testdata/entities.data";
import { sorting } from "../src/helpers/sorting";
import { isEqualByNames } from "../src/helpers/isEqual";
import { omit } from "../src/helpers/omit";
import { rawClient } from "../src/services/raw.service";
import { stringifyTopLevel } from "../src/helpers/stringifyObject";

describe("Сущности", function() {
  const datagenerator = new DataGenerator();
  describe("Без авторизации", function() {
    const entitiesApi = new EntitiesApi();
    const entitiesService = new EntitiesService(entitiesApi);
    correctSearch.forEach((testItem) => {
      it(`Получение списка сущностей без авторизации. Позитивные тесты (цикл проверок): ${testItem.description}`, async function() {
        //Act
        const data = await entitiesService.getAll(
          testItem.data.category,
          testItem.data.sort,
          testItem.status,
        );
        //Assert
        assert.ok(Array.isArray(data));
        //Если что-то вернулось, и мы задали направление сортировки - то нужно проверить порядок
        if (testItem.data.sort && data.length > 0) {
          const mySortedArray = sorting(data, testItem.data.sort);
          assert.ok(isEqualByNames(data, mySortedArray));
        }
        //Если что-то вернулось, и мы задали категорию для фильтрации - то нужно проверить выдачу
        if (
          testItem.data.category &&
          testItem.data.category !== MythologyGetCategoryEnum.All &&
          data.length > 0
        ) {
          assert.ok(
            data.every((entity) => entity.category === testItem.data.category),
          );
        }
      });
    });

    incorrectSearch.forEach((testItem) => {
      it(`Получение списка сущностей без авторизации. Негативные тесты (цикл проверок): ${testItem.description}`, async function() {
        //Act
        const response = await rawClient.get(
          `/mythology/?category=${testItem.data.category}&sort=${testItem.data.sort}`,
        );
        const data = response.data as MythologyEntity[];
        //Assert
        assert.equal(response.status, 200);
        assert.ok(
          !data.some((entity) => entity.category !== testItem.data.category),
        );
      });
    });

    //**
    // Так как доступа в БД нет, запрашиваем все сущности и одну, сравниваем их по ID
    //  */
    it("Получение одной сущности без авторизации. Позитивный тест", async function() {
      //Arrange
      const allDefaultEntities = await entitiesService.getAll();
      const randomId = allDefaultEntities[
        datagenerator.getRandomNumberFromInterval(
          1,
          allDefaultEntities.length - 1,
        )
      ].id!;
      //Act
      const oneEntitie = await entitiesService.getById(randomId);
      //Assert
      assert.deepStrictEqual(
        oneEntitie,
        allDefaultEntities.filter((entitie) => entitie.id === randomId)[0],
        "Сущности отличаются",
      );
    });

    //**
    // Так как доступа в БД нет, запрашиваем все сущности и одну, сравниваем их по ID
    //  */
    it("Получение одной сущности без авторизации, такого номера нет. Негативный тест", async function() {
      //Arrange
      const allDefaultEntities = await entitiesService.getAll();
      const maxId = allDefaultEntities.reduce(
        (max, item) => Math.max(max, item.id!),
        0,
      );
      //Act
      const response = await rawClient.get(
        `/mythology/${maxId +
          datagenerator.getRandomNumberFromInterval(100, 1000)}`,
      );
      //Assert
      assert.equal(response.status, 404);
    });

    incorrectID.forEach((testItem) => {
      it(`Получение сущности по некорректному номеру. Негативные тесты (цикл проверок): ${testItem.description}`, async function() {
        //Act
        const response = await rawClient.get(`/mythology/${testItem.data.id}`);
        //Assert
        assert.equal(response.status, 400);
        assert.ok("error" in response.data, "Ожидалась ошибка");
        assert.equal(
          response.data.error,
          testItem.message,
          `Ожидался error ${testItem.message}, но получен ${response.data.error}`,
        );
      });
    });
  });

  describe("С авторизацией", async function() {
    let entitiesService: EntitiesService;
    let token: string;
    const entitiesApiWithoutToken = new EntitiesApi();
    const entitiesServiceWithoutToken = new EntitiesService(
      entitiesApiWithoutToken,
    );

    before(async function() {
      token = await prepareToken();
      const config = new Configuration({
        accessToken: token,
      });
      const entitiesApi = new EntitiesApi(config);
      entitiesService = new EntitiesService(entitiesApi);
    });
    describe("Удаление", async function() {
      it("Одной сущности после её создания (с авторизацией). Позитивный тест", async function() {
        //Arrange
        const entity = {
          name: datagenerator.generateAlphanumeric(
            datagenerator.getRandomNumberFromInterval(2, 50),
          ),
          category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
          desc: datagenerator.generateAlphanumeric(
            datagenerator.getRandomNumberFromInterval(2, 1000),
          ),
          img: datagenerator.generateAlphanumeric(
            datagenerator.getRandomNumberFromInterval(2, 1000),
          ),
        };
        const data = await entitiesService.create(entity, 201);
        //Act
        await entitiesService.delete(data.id!, 204);
        //Assert
        const response = await entitiesService.getById(data.id!, 404);
      });

      it("Удаление сущности из защищенного списка, негативный тест", async function() {
        //Arrange
        const number = datagenerator.getRandomNumberFromInterval(1, 31);
        //Act
        await entitiesService.delete(number, 403);
      });

      it("Удаление сущности без авторизации, негативный тест", async function() {
        //Arrange
        const number = datagenerator.getRandomNumberFromInterval(32, 100);
        //Act
        await entitiesServiceWithoutToken.delete(number, 401);
      });

      it("Удаление потенциально не существующей сущности", async function() {
        //Arrange
        const allDefaultEntities = await entitiesService.getAll();
        const number =
          allDefaultEntities.reduce((max, ent) => Math.max(max, ent.id!), 0) +
          10;
        //Act
        await entitiesService.delete(number, 404);
      });

      it("Повторное. Негативный тест, сущность не должна быть найдена", async function() {
        //Arrange
        const entity = {
          name: datagenerator.generateAlphanumeric(
            datagenerator.getRandomNumberFromInterval(2, 50),
          ),
          category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
          desc: datagenerator.generateAlphanumeric(
            datagenerator.getRandomNumberFromInterval(2, 1000),
          ),
          img: datagenerator.generateAlphanumeric(
            datagenerator.getRandomNumberFromInterval(2, 1000),
          ),
        };
        const data = await entitiesService.create(entity, 201);
        await entitiesService.delete(data.id!, 204);
        //Act
        await entitiesService.delete(data.id!, 404);
      });

      incorrectID.forEach((testItem) => {
        it(`Удаление с некорректным ID. Негативные тесты (цикл проверок): ${testItem.description}`, async function() {
          //Act
          await entitiesService.delete(
            testItem.data.id as number,
            testItem.status,
          );
        });
      });
    });

    describe("Создание", async function() {
      createCorrectEntitie.forEach((testItem) => {
        it(`Создание сущностей с разными параметрами. Позитивные тесты (цикл проверок): ${testItem.description}`, async function() {
          //Act
          const data = await entitiesService.create(
            testItem.data,
            testItem.status,
          );
          //Assert
          const oneEntitie = await entitiesService.getById(data.id!);
          //Убеждаемся, что оба объекта без id и убираем пустой id из сравнения
          const oneEntitieWithoutId = oneEntitie.img
            ? omit(oneEntitie, ["id"])
            : omit(oneEntitie, ["id", "img"]);
          const testEntitieWithoutId = omit(testItem.data, ["id"]);
          assert.deepStrictEqual(testEntitieWithoutId, oneEntitieWithoutId);
        });
      });

      createIncorrectEntitie.forEach((testItem) => {
        it(`Создание сущностей с разными параметрами. Негативные тесты (цикл проверок): ${testItem.description}`, async function() {
          //Arange
          const dataForCreation = stringifyTopLevel(testItem.data);
          //Act
          const responseData = await rawClient.post(
            "/mythology",
            dataForCreation,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          //Assert
          assert.equal(
            responseData.status,
            testItem.status,
            `Ожидался ${testItem.status}, получен ${responseData.status}`,
          );
          if (testItem.message) {
            assert.ok("error" in responseData.data, "Ожидалась ошибка");
            assert.equal(
              responseData.data.error,
              testItem.message,
              `Ожидался error ${testItem.message}, но получен ${responseData.data.error}`,
            );
          }
        });
      });

      it("Создание сущности (без авторизации). Негативный тест", async function() {
        //Arrange
        const entity = {
          name: datagenerator.generateAlphanumeric(
            datagenerator.getRandomNumberFromInterval(2, 50),
          ),
          category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
          desc: datagenerator.generateAlphanumeric(
            datagenerator.getRandomNumberFromInterval(2, 1000),
          ),
          img: datagenerator.generateAlphanumeric(
            datagenerator.getRandomNumberFromInterval(2, 1000),
          ),
        };
        //Act
        await entitiesServiceWithoutToken.create(entity, 401);
      });
    });

    describe("Обновление сущностей частично PATCH", async function() {
      correctPatchTest.forEach((testItem) => {
        it(`Частичное обновление. Позитивные тесты (цикл проверок): ${testItem.description}`, async function() {
          //Arrange
          const randomEntity: MythologyEntity = {
            name: datagenerator.generateAlphanumeric(
              datagenerator.getRandomNumberFromInterval(3, 100),
            ),
            category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
            desc: datagenerator.generateAlphanumeric(
              datagenerator.getRandomNumberFromInterval(2, 50),
            ),
            img: datagenerator.generateAlphanumeric(
              datagenerator.getRandomNumberFromInterval(2, 50),
            ),
          };
          const createdEntity = await entitiesService.create(randomEntity, 201);
          //Act
          const data = (await entitiesService.patch(
            createdEntity.id!,
            testItem.data,
          )) as MythologyEntity;
          const expectedEntity: MythologyEntity = {
            ...createdEntity,
            ...testItem.data,
          };
          //Assert
          assert.deepStrictEqual(data, expectedEntity);
        });
      });

      it("Обновление поля с изображением на NULL. Позитивный тест", async function() {
        //Arrange
        const randomEntity = {
          name: datagenerator.generateAlphanumeric(
            datagenerator.getRandomNumberFromInterval(3, 100),
          ),
          category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
          desc: datagenerator.generateAlphanumeric(
            datagenerator.getRandomNumberFromInterval(2, 50),
          ),
          img: datagenerator.generateAlphanumeric(
            datagenerator.getRandomNumberFromInterval(2, 50),
          ),
        };
        const createdEntity = await entitiesService.create(randomEntity, 201);
        const entitieWithNull = {
          name: datagenerator.generateAlphanumeric(
            datagenerator.getRandomNumberFromInterval(3, 100),
          ),
          category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
          desc: datagenerator.generateAlphanumeric(
            datagenerator.getRandomNumberFromInterval(2, 50),
          ),
          img: null,
        };
        //Act
        const data = (
          await rawClient.patch(
            `/mythology/${createdEntity.id!}`,
            entitieWithNull,
            { headers: { Authorization: `Bearer ${token}` } },
          )
        ).data;
        const expectedEntity = { ...createdEntity, ...entitieWithNull };
        //Assert
        assert.deepStrictEqual(data, expectedEntity);
      });
    });

    describe("Обновление сущностей полностью PUT", async function() {
      let createdEntity: MythologyEntity;
       before(async function() {const randomEntity: MythologyEntity = {
            name: datagenerator.generateAlphanumeric(
              datagenerator.getRandomNumberFromInterval(3, 100),
            ),
            category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
            desc: datagenerator.generateAlphanumeric(
              datagenerator.getRandomNumberFromInterval(2, 50),
            ),
            img: datagenerator.generateAlphanumeric(
              datagenerator.getRandomNumberFromInterval(2, 50),
            ),
          };
        createdEntity = await entitiesService.create(randomEntity, 201)});
    
        createCorrectEntitie.forEach((testItem) => {
        it.only(`Обновление сущностей целиком с разными параметрами. Позитивные тесты (цикл проверок): ${testItem.description}`, async function() {
          //Act
            const data = await entitiesService.update(
            createdEntity.id!,
            testItem.data,
          );
          const actualEntitie = await entitiesService.getById(createdEntity.id!);
          const oneEntitieWithoutId = actualEntitie.img
            ? omit(actualEntitie, ["id"])
            : omit(actualEntitie, ["id", "img"]);
          //Assert
          assert.deepStrictEqual(oneEntitieWithoutId, omit(testItem.data, ["id"]));
        })});

    });
  });
});
