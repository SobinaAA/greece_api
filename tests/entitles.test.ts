import { strict as assert } from "assert";
import { DataGenerator } from "../src/helpers/data.generator";
import {
  Configuration,
  EntitiesApi,
  MythologyEntityCategoryEnum,
  MythologyGetCategoryEnum,
} from "../src/clients";
import { EntitiesService } from "../src/services/entitles.service";
import { prepareToken } from "../src/helpers/login";
import {
  correctSearch,
  createCorrectEntitie,
  createIncorrectEntitie,
  incorrectID,
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
        it.only(`Создание сущностей с разными параметрами. Негативные тесты (цикл проверок): ${testItem.description}`, async function() {
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
            assert.equal(responseData.data.error, testItem.message, `Ожидался error ${testItem.message}, но получен ${responseData.data.error}`);
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
  });
});
