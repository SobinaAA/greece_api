import { strict as assert } from "assert";
import {
  brokenRegisterUserData,
  correctRegisterUserData,
  incorrectRegisterUserData,
} from "./testdata/users.data";
import { AuthService } from "../src/services/auth.service";
import { DataGenerator } from "../src/helpers/data.generator";
import { authMessages, registerMessages } from "../src/data/messages";
import { LoginPost200Response } from "../src/clients";
import { ApiResponse, AuthResponseUnsuccess } from "../src/types/apiResponse.types.ts";
import { rawClient } from "../src/services/raw.service";
import addContext from "mochawesome/addContext";
import { stringifyTopLevel } from "../src/helpers/stringifyObject";

describe("Пользователи", function() {
  const authService = new AuthService();
  const datagenerator = new DataGenerator();

  describe("Регистрация", function() {
    correctRegisterUserData.forEach((testItem) => {
      it(`Регистрация. Позитивные тесты (цикл проверок): Должен быть создан пользователь. ${testItem.description}`, async function() {
        //Act
        const data = await authService.register(testItem.credentials, 201);
        //Assert
        assert.equal(
          data.message,
          registerMessages.ok,
          `Ожидался message ${registerMessages.ok}, но получен ${data.message}`
        );
        assert.ok(data.success, "Ожидалось, что регистрация успешна");
      });
    });

    brokenRegisterUserData.forEach((testItem) => {
      it(`Негативные тесты (цикл проверок): Не должен быть создан пользователь, не те типы данных/структура запроса. ${testItem.description}`, async function() {
        addContext(
          this,
          "Создаются пользователи с типами данных в username, отличными от строки: boolean, number, object, array"
        );
        //Act
        const response = await rawClient.post(
          "/register",
          testItem.credentials
        );
        //Assert
        const data = response.data as ApiResponse<null>;
        assert.equal(
          response.status,
          400,
          `Ожидался статус 400, но получен ${response.status}`
        );
        assert.equal(
          data.message,
          registerMessages.failed,
          `Ожидался message ${registerMessages.failed}, но получен ${data.message}`
        );
        assert.ok(!data.success, "Ожидалось, что регистрация неуспешна");
      });
    });

    it("Негативный. Повторная регистрация.", async function() {
      //Arrange
      const credentials = {
        username: datagenerator.generateStringWithAllSymbols(
          datagenerator.getRandomNumberFromInterval(2, 49)
        ),
        password: datagenerator.generateStringWithAllSymbols(
          datagenerator.getRandomNumberFromInterval(2, 49)
        ),
      };
      //Act
      await authService.register(credentials);
      const data = await authService.register(credentials, 400);
      //Assert
      assert.equal(
        data.message,
        registerMessages.failed,
        `Ожидался message ${registerMessages.failed}, но получен ${data.message}`
      );
      assert.ok(!data.success, "Ожидалось, что регистрация неуспешна");
    });

    incorrectRegisterUserData.forEach((testItem) => {
      it(`Негативные тесты (цикл проверок): Не должен быть создан пользователь. ${testItem.description}`, async function() {
        addContext(
          this,
          "Создаются пользователи с пустым паролем, пустым логином"
        );
        //Act
        const data = await authService.register(testItem.credentials, 400);
        //Assert
        assert.equal(
          data.message,
          registerMessages.failed,
          `Ожидался message ${registerMessages.failed}, но получен ${data.message}`
        );
        assert.ok(!data.success, "Ожидалось, что регистрация неуспешна");
      });
    });
  });

  describe("Авторизация", function() {
    const credentials = {
      username: datagenerator.generateStringWithAllSymbols(
        datagenerator.getRandomNumberFromInterval(1, 50)
      ),
      password: datagenerator.generateStringWithAllSymbols(
        datagenerator.getRandomNumberFromInterval(1, 50)
      ),
    };
    before("Создаем пользователя до тестов на авторизацию", async function() {
      await authService.register(credentials);
    });

    it("Позитивный. Авторизация зарегистрированным пользователем.", async function() {
      //Act
      const data = await authService.auth(credentials, 200);
      //Assert
      const data200 = data as ApiResponse<LoginPost200Response>;
      const token = data200.data?.token;
      assert.ok(token && token.length > 0, "Токен не должен быть пустым");
      assert.equal(
        data200.message,
        authMessages.ok,
        `Ожидался message ${authMessages.ok}, но получен ${data200.message}`
      );
    });

    it("Негативный. Авторизация с неправильным паролем пользователя.", async function() {
      const credentialsFakePassword = {
        username: credentials.username,
        password: datagenerator.generateStringWithAllSymbols(
          datagenerator.getRandomNumberFromInterval(1, 50)
        ),
      };
      //Act
      const data = await authService.auth(credentialsFakePassword, 401);
      //Assert
      const data401 = data as ApiResponse<AuthResponseUnsuccess>;
      assert.ok(!data401.success, "Ожидалось, что авторизация неуспешна");
      assert.equal(
        data401.message,
        authMessages.incorrect,
        `Ожидался message ${authMessages.incorrect}, но получен ${data401.message}`
      );
    });

    it("Негативный. Авторизация с пустыми данными.", async function() {
      addContext(
        this,
        "Возможна авторизация с пустыми полями: скорее всего, баг связан с багом регистрации с пустыми полями"
      );
      const credentialsFakePassword = {
        username: "",
        password: "",
      };
      //Act
      const data = await authService.auth(credentialsFakePassword, 401);
      //Assert
      const data401 = data as ApiResponse<AuthResponseUnsuccess>;
      assert.ok(!data401.success, "Ожидалось, что авторизация неуспешна");
      assert.equal(
        data401.message,
        authMessages.incorrect,
        `Ожидался message ${authMessages.incorrect}, но получен ${data401.message}`
      );
    });

    brokenRegisterUserData.forEach((testItem) => {
      it.only(`Негативные тесты (цикл проверок): Не должна пройти авторизация пользователя. ${testItem.description}`, async function() {
        addContext(
          this,
          "Возможна авторизация с объектом или числом в имени, а также 500 ошибка на авторизацию с boolean в обоих полях"
        );
        //Arrange
        //Преобразуем некорректные данные в строки для предварительной регистрации пользователя - до авторизации
        const dataForRegister = stringifyTopLevel(testItem.credentials);
        await rawClient.post("/register", dataForRegister);
        //Act
        //Используем не соответствующие типам данные
        const response = await rawClient.post("/login", testItem.credentials);
        //Assert
        const data = response.data as ApiResponse<null>;
        assert.equal(
          response.status,
          401,
          `Ожидался статус 401, но получен ${response.status}`
        );
        assert.equal(
          data.message,
          authMessages.incorrect,
          `Ожидался message ${authMessages.incorrect}, но получен ${data.message}`
        );
        assert.ok(!data.success, "Ожидалось, что авторизация неуспешна");
      });
    });
  });
});
