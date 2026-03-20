import { strict as assert } from "assert";
import { DataGenerator } from "../src/helpers/data.generator";
import { getAllMessages } from "../src/data/messages";
import {
  Configuration,
  EntitiesApi,
  LoginPost200Response,
} from "../src/clients";
import {
  ApiResponse,
  AuthResponseUnsuccess,
} from "../src/types/apiResponse.types.ts";
import { rawClient } from "../src/services/raw.service";
import addContext from "mochawesome/addContext";
import { stringifyTopLevel } from "../src/helpers/stringifyObject";
import { EntitiesService } from "../src/services/entitles.service";
import { prepareToken } from "../src/helpers/login";
import { correctSearch } from "./testdata/entities.data";
import { sorting } from "../src/helpers/sorting";
import { isEqualByNames } from "../src/helpers/isEqual";

describe("Сущности", function() {
  const datagenerator = new DataGenerator();
  describe("Без авторизации", function() {
    const entitiesApi = new EntitiesApi();
    const entitiesService = new EntitiesService(entitiesApi);
    correctSearch.forEach((testItem) => {
      it.only(`Получение сущностей без авторизации. Позитивные тесты (цикл проверок): ${testItem.description}`, async function() {
        //Act
        const data = await entitiesService.getAll(
          testItem.parameters.category,
          testItem.parameters.sort
        );
        //Assert
        assert.equal(
          data.message,
          getAllMessages.ok,
          `Ожидался message ${getAllMessages.ok}, но получен ${data.message}`
        );
        assert.ok(data.success, "Ожидалось, что запрос успешен");
        //Если что-то вернулось, и мы задали направление сортировки - то нужно проверить порядок
        if (testItem.parameters.sort && data.data) {
          const mySortedArray = sorting(data.data, testItem.parameters.sort);
          assert.ok(isEqualByNames(data.data, mySortedArray));
        }
        //Если что-то вернулось, и мы задали категорию для фильтрации - то нужно проверить выдачу
        if (testItem.parameters.category && data.data) {
          assert.ok(
            data.data.every(
              (entitie) => entitie.category === testItem.parameters.category
            )
          );
        }
      });
    });
  });
  describe("С авторизацией", async function() {
    const token = await prepareToken();
    const config = new Configuration({
      accessToken: token,
    });
    const entitiesApi = new EntitiesApi(config);
    const entitiesService = new EntitiesService(entitiesApi);
  });
});
