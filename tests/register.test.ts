import { strict as assert } from 'assert';
import {
  IncorrectRegisterUserData,
  correctRegisterUserData,
  IncorrectAuthUserData
} from './testdata/users.data';
import { AuthService } from '../src/services/auth.service';
import { DataGenerator } from '../src/helpers/data.generator';
import { authMessages, registerMessages } from '../src/data/messages';
import { rawClient } from '../src/services/raw.service';
import addContext from 'mochawesome/addContext';
import { stringifyTopLevel } from '../src/helpers/stringifyObject';

describe('Пользователи', function () {
  const authService = new AuthService();
  const datagenerator = new DataGenerator();

  describe('Регистрация', function () {
    correctRegisterUserData.forEach((testItem) => {
      it(`Регистрация. Позитивные тесты: ${testItem.description}`, async function () {
        //Act
        const data = await authService.register(testItem.data, testItem.status);
        //Assert
        assert.ok('message' in data, 'Ожидался успешный ответ');
        assert.equal(
          data.message,
          testItem.message,
          `Ожидался message ${testItem.message}, но получен ${data.message}`
        );
      });
    });

    IncorrectRegisterUserData.forEach((testItem) => {
      it(`Негативные тесты (тип данных): ${testItem.description}`, async function () {
        addContext(this, 'username не строка: boolean, number, object, array');
        //Act
        const response = await rawClient.post('/register', testItem.data);
        const data = response.data;
        //Assert
        assert.equal(response.status, testItem.status);
        assert.ok('error' in data, 'Ожидалась ошибка');
        assert.equal(
          data.error,
          testItem.message,
          `Ожидался error ${testItem.message}, но получен ${data.error}`
        );
      });
    });

    it('Негативный. Повторная регистрация.', async function () {
      //Arrange
      const credentials = {
        username: datagenerator.generateStringWithAllSymbols(
          datagenerator.getRandomNumberFromInterval(2, 49)
        ),
        password: datagenerator.generateStringWithAllSymbols(
          datagenerator.getRandomNumberFromInterval(2, 49)
        )
      };
      await authService.register(credentials);
      //Act
      const data = await authService.register(credentials, 400);
      //Assert
      assert.ok('error' in data, 'Ожидалась ошибка');
      assert.equal(
        data.error,
        registerMessages.failed,
        `Ожидался error ${registerMessages.failed}, но получен ${data.error}`
      );
    });
  });

  describe('Авторизация', function () {
    const credentials = {
      username: datagenerator.generateStringWithAllSymbols(
        datagenerator.getRandomNumberFromInterval(1, 50)
      ),
      password: datagenerator.generateStringWithAllSymbols(
        datagenerator.getRandomNumberFromInterval(1, 50)
      )
    };

    before(async function () {
      await authService.register(credentials);
    });

    it('Позитивный. Авторизация зарегистрированным пользователем.', async function () {
      //Act
      const data = await authService.auth(credentials, 200);
      //Assert
      assert.ok('token' in data, 'Ожидался токен');
      assert.ok(data.token.length > 0, 'Токен не должен быть пустым');
    });

    it('Негативный. Неверный пароль.', async function () {
      //Arrange
      const credentialsFakePassword = {
        username: credentials.username,
        password: datagenerator.generateStringWithAllSymbols(
          datagenerator.getRandomNumberFromInterval(1, 50)
        )
      };
      //Act
      const data = await authService.auth(credentialsFakePassword, 401);
      //Assert
      assert.ok('error' in data, 'Ожидалась ошибка');
      assert.equal(
        data.error,
        authMessages.incorrect,
        `Ожидался error ${authMessages.incorrect}, но получен ${data.error}`
      );
    });

    it('Негативный. Не зарегистрированный пользователь', async function () {
      //Arrange
      const randomCredentials = {
        username: datagenerator.generateStringWithAllSymbols(
          datagenerator.getRandomNumberFromInterval(1, 50)
        ),
        password: datagenerator.generateStringWithAllSymbols(
          datagenerator.getRandomNumberFromInterval(1, 50)
        )
      };
      //Act
      const data = await authService.auth(randomCredentials, 401);
      //Assert
      assert.ok('error' in data, 'Ожидалась ошибка');
      assert.equal(
        data.error,
        authMessages.incorrect,
        `Ожидался error ${authMessages.incorrect}, но получен ${data.error}`
      );
    });

    IncorrectAuthUserData.forEach((testItem) => {
      it(`Негативные тесты: ${testItem.description}`, async function () {
        //Arrange
        const dataForRegister = stringifyTopLevel(testItem.data);
        await rawClient.post('/register', dataForRegister);
        //Act
        const response = await rawClient.post('/login', testItem.data);
        const data = response.data;
        //Assert
        assert.equal(response.status, testItem.status);
        assert.ok('error' in data, 'Ожидалась ошибка');
        assert.equal(
          data.error,
          testItem.message,
          `Ожидался error ${testItem.message}, но получен ${data.error}`
        );
      });
    });
  });
});
