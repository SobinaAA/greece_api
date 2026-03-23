import { strict as assert } from "assert";
import {
  brokenRegisterUserData,
  IncorrectRegisterUserData,
  correctRegisterUserData,
  emptyRegisterUserData,
} from "./testdata/users.data";
import { AuthService } from "../src/services/auth.service";
import { DataGenerator } from "../src/helpers/data.generator";
import { authMessages, registerMessages } from "../src/data/messages";
import { rawClient } from "../src/services/raw.service";
import addContext from "mochawesome/addContext";
import { stringifyTopLevel } from "../src/helpers/stringifyObject";

describe.only("Пользователи", function() {
  const authService = new AuthService();
  const datagenerator = new DataGenerator();

  describe("Регистрация", function() {
    correctRegisterUserData.forEach((testItem) => {
      it(`Регистрация. Позитивные тесты: ${testItem.description}`, async function() {
        const data = await authService.register(testItem.credentials, 201);

        assert.ok("message" in data, "Ожидался успешный ответ");
        assert.equal(
          data.message,
          registerMessages.ok,
          `Ожидался message ${registerMessages.ok}, но получен ${data.message}`
        );
      });
    });

    brokenRegisterUserData.forEach((testItem) => {
      it(`Негативные тесты (некорректные объекты): ${testItem.description}`, async function() {
        addContext(this, "username не строка: boolean, number, object, array");
        const response = await rawClient.post(
          "/register",
          testItem.credentials
        );
        const data = response.data;

        assert.equal(response.status, 400);

        assert.ok("error" in data, "Ожидалась ошибка");
        assert.equal(
          data.error,
          registerMessages.empty,
          `Ожидался error ${registerMessages.failed}, но получен ${data.error}`
        );
      });
    });

    IncorrectRegisterUserData.forEach((testItem) => {
      it(`Негативные тесты (тип данных): ${testItem.description}`, async function() {
        addContext(this, "username не строка: boolean, number, object, array");
        const response = await rawClient.post(
          "/register",
          testItem.credentials
        );
        const data = response.data;

        assert.equal(response.status, 400);

        assert.ok("error" in data, "Ожидалась ошибка");
        assert.equal(
          data.error,
          registerMessages.failed,
          `Ожидался error ${registerMessages.failed}, но получен ${data.error}`
        );
      });
    });

    it("Негативный. Повторная регистрация.", async function() {
      const credentials = {
        username: datagenerator.generateStringWithAllSymbols(
          datagenerator.getRandomNumberFromInterval(2, 49)
        ),
        password: datagenerator.generateStringWithAllSymbols(
          datagenerator.getRandomNumberFromInterval(2, 49)
        ),
      };

      await authService.register(credentials);
      const data = await authService.register(credentials, 400);

      assert.ok("error" in data, "Ожидалась ошибка");
      assert.equal(
        data.error,
        registerMessages.failed,
        `Ожидался error ${registerMessages.failed}, но получен ${data.error}`
      );
    });

    emptyRegisterUserData.forEach((testItem) => {
      it(`Негативные тесты (пустые): ${testItem.description}`, async function() {
        addContext(this, "пустой username или password");
        const response = await rawClient.post(
          "/register",
          testItem.credentials
        );
        const data = response.data;

        assert.equal(response.status, 400);

        assert.ok("error" in data, "Ожидалась ошибка");
        assert.equal(
          data.error,
          registerMessages.empty,
          `Ожидался error ${registerMessages.failed}, но получен ${data.error}`
        );
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

    before(async function() {
      await authService.register(credentials);
    });

    it("Позитивный. Авторизация зарегистрированным пользователем.", async function() {
      const data = await authService.auth(credentials, 200);

      assert.ok("token" in data, "Ожидался токен");
      assert.ok(data.token.length > 0, "Токен не должен быть пустым");
    });

    it("Негативный. Неверный пароль.", async function() {
      const credentialsFakePassword = {
        username: credentials.username,
        password: datagenerator.generateStringWithAllSymbols(
          datagenerator.getRandomNumberFromInterval(1, 50)
        ),
      };

      const data = await authService.auth(credentialsFakePassword, 401);

      assert.ok("error" in data, "Ожидалась ошибка");
      assert.equal(
        data.error,
        authMessages.incorrect,
        `Ожидался error ${authMessages.incorrect}, но получен ${data.error}`
      );
    });

    brokenRegisterUserData.forEach((testItem) => {
      it(`Негативные тесты (объект не соответствует ожидаемому): ${testItem.description}`, async function() {
        const dataForRegister = stringifyTopLevel(testItem.credentials);
        await rawClient.post("/register", dataForRegister);

        const response = await rawClient.post("/login", testItem.credentials);
        const data = response.data;

        assert.equal(response.status, 401);

        assert.ok("error" in data, "Ожидалась ошибка");
        assert.equal(
          data.error,
          authMessages.incorrect,
          `Ожидался error ${authMessages.incorrect}, но получен ${data.error}`
        );
      });
    });

    emptyRegisterUserData.forEach((testItem) => {
      it(`Негативные тесты (пустые данные): ${testItem.description}`, async function() {
        addContext(this, "username и password допускаются пустыми");
        const response = await rawClient.post("/login", testItem.credentials);
        const data = response.data;
        assert.equal(response.status, 401);
        assert.ok("error" in data, "Ожидалась ошибка");
        assert.equal(
          data.error,
          authMessages.incorrect,
          `Ожидался error ${authMessages.incorrect}, но получен ${data.error}`
        );
      });
    });
  });
});
