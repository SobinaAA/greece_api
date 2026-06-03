import { RegisterPostRequest } from '../../src/clients/api';
import { authMessages, registerMessages } from '../../src/data/messages';
import { DataGenerator } from '../../src/helpers/data.generator';
import { TestData } from '../../src/types/test.types';

const datagenerator = new DataGenerator();

interface UserTest extends TestData {
  data: RegisterPostRequest;
}

export const correctRegisterUserData: UserTest[] = [
  {
    data: {
      username: datagenerator.generateAlphanumeric(1),
      password: datagenerator.generateAlphanumeric(1)
    },
    description: 'Ультра-короткие случайные поля (Alphanumeric)',
    status: 201,
    message: registerMessages.ok
  },
  {
    data: {
      username: datagenerator.generateStringWithAllSymbols(
        datagenerator.getRandomNumberFromInterval(2, 49)
      ),
      password: datagenerator.generateStringWithAllSymbols(
        datagenerator.getRandomNumberFromInterval(2, 49)
      )
    },
    description: 'Слуачйная длина полей (2-49)',
    status: 201,
    message: registerMessages.ok
  },
  {
    data: {
      username: datagenerator.generateStringWithAllSymbols(50),
      password: datagenerator.generateStringWithAllSymbols(214)
    },
    description:
      'Большое значение в поле логин и разумно большое (нет ограничений) в пароле (generateStringWithAllSymbols)',
    status: 201,
    message: registerMessages.ok
  }
];

export const IncorrectRegisterUserData: TestData[] = [
  {
    data: {
      username: datagenerator.generateStringWithAllSymbols(51),
      password: datagenerator.generateStringWithAllSymbols(214)
    },
    description: 'Чрезмерно длинный Логин',
    status: 400,
    message: registerMessages.failed
  },
  {
    data: {
      username: datagenerator.generateStringWithAllSymbols(50),
      password: datagenerator.getRandomNumberFromInterval(1, 100000)
    },
    description: 'В поле Пароль не строка, а число',
    status: 400,
    message: registerMessages.failed
  },
  {
    data: {
      username: datagenerator.getRandomNumberFromInterval(1, 100000), //Зарегистрирован пользователь
      password: datagenerator.generateStringWithAllSymbols(50)
    },
    description: 'В поле Логин не строка, а число',
    status: 400,
    message: registerMessages.failed
  },
  {
    data: {
      username: datagenerator.generateStringWithAllSymbols(50),
      password: [datagenerator.generateStringWithAllSymbols(10)]
    },
    description: 'В поле Пароль не строка, а массив',
    status: 400,
    message: registerMessages.failed
  },
  {
    data: {
      username: [datagenerator.generateStringWithAllSymbols(10)],
      password: datagenerator.generateStringWithAllSymbols(51)
    },
    description: 'В поле Логин не строка, а массив',
    status: 400,
    message: registerMessages.failed
  },
  {
    data: {
      username: { username: datagenerator.generateStringWithAllSymbols(10) },
      password: datagenerator.generateStringWithAllSymbols(51)
    },
    description: 'В поле Логин не строка, а объект',
    status: 400,
    message: registerMessages.failed
  },
  {
    data: {
      username: datagenerator.generateStringWithAllSymbols(50),
      password: { password: datagenerator.generateStringWithAllSymbols(10) }
    },
    description: 'В поле Пароль не строка, а объект',
    status: 400,
    message: registerMessages.failed
  },
  {
    data: {
      password: datagenerator.getRandomBoolean()
    },
    description: 'Нет поля с Логином',
    status: 400,
    message: registerMessages.empty
  },
  {
    data: {
      username: datagenerator.generateStringWithAllSymbols(50)
    },
    description: 'Нет поля с паролем',
    status: 400,
    message: registerMessages.empty
  },
  {
    data: {
      field1: datagenerator.generateStringWithAllSymbols(50),
      field2: datagenerator.getRandomNumberFromInterval(1, 1000),
      field3: null,
      field4: datagenerator.getRandomBoolean(),
      field5: {
        fild51: datagenerator.getRandomNumberFromInterval(1, 1000),
        field52: datagenerator.generateStringWithAllSymbols(51)
      }
    },
    description: 'Отпправляем какой-то другой объект вместо ожидаемого',
    status: 400,
    message: registerMessages.empty
  },
  {
    data: {
      username: '',
      password: datagenerator.generateStringWithAllSymbols(
        datagenerator.getRandomNumberFromInterval(2, 49)
      )
    },
    description: 'Пустой логин',
    status: 400,
    message: registerMessages.empty
  },
  {
    data: {
      username: datagenerator.generateStringWithAllSymbols(
        datagenerator.getRandomNumberFromInterval(2, 49)
      ),
      password: ''
    },
    description: 'Пустой пароль',
    status: 400,
    message: registerMessages.empty
  },
  {
    data: {
      username: '',
      password: ''
    },
    description: 'Пустые оба поля',
    status: 400,
    message: registerMessages.empty
  },
  {
    data: {
      username: null,
      password: datagenerator.generateStringWithAllSymbols(50)
    },
    description: 'NULL в Логине',
    status: 400,
    message: registerMessages.empty
  },
  {
    data: {
      username: null,
      password: datagenerator.generateStringWithAllSymbols(50)
    },
    description: 'NULL в Пароле',
    status: 400,
    message: registerMessages.empty
  },
  {
    data: {
      username: null,
      password: null
    },
    description: 'NULL в обоих полях',
    status: 400,
    message: registerMessages.empty
  },
  {
    data: {
      username: datagenerator.getRandomBoolean(),
      password: datagenerator.getRandomBoolean()
    },
    description: 'Boolean в обоих полях',
    status: 400,
    message: registerMessages.failed
  },
  {
    data: {
      username: datagenerator.getRandomBoolean(),
      password: datagenerator.generateStringWithAllSymbols(
        datagenerator.getRandomNumberFromInterval(2, 49)
      )
    },
    description: 'Boolean в Логине',
    status: 400,
    message: registerMessages.failed
  },
  {
    data: {
      username: datagenerator.generateStringWithAllSymbols(
        datagenerator.getRandomNumberFromInterval(2, 49)
      ),
      password: datagenerator.getRandomBoolean()
    },
    description: 'Boolean в Пароле',
    status: 400,
    message: registerMessages.failed
  }
];

export const IncorrectAuthUserData: TestData[] = [
  {
    data: {
      username: datagenerator.generateStringWithAllSymbols(51),
      password: datagenerator.generateStringWithAllSymbols(214)
    },
    description: 'Чрезмерно длинный Логин',
    status: 401,
    message: authMessages.incorrect
  },
  {
    data: {
      username: datagenerator.generateStringWithAllSymbols(50),
      password: datagenerator.getRandomNumberFromInterval(1, 100000)
    },
    description: 'В поле Пароль не строка, а число',
    status: 401,
    message: authMessages.incorrect
  },
  {
    data: {
      username: datagenerator.getRandomNumberFromInterval(1, 100000), //Зарегистрирован пользователь
      password: datagenerator.generateStringWithAllSymbols(50)
    },
    description: 'В поле Логин не строка, а число',
    status: 401,
    message: authMessages.incorrect
  },
  {
    data: {
      username: datagenerator.generateStringWithAllSymbols(50),
      password: [datagenerator.generateStringWithAllSymbols(10)]
    },
    description: 'В поле Пароль не строка, а массив',
    status: 401,
    message: authMessages.incorrect
  },
  {
    data: {
      username: [datagenerator.generateStringWithAllSymbols(10)],
      password: datagenerator.generateStringWithAllSymbols(51)
    },
    description: 'В поле Логин не строка, а массив',
    status: 401,
    message: authMessages.incorrect
  },
  {
    data: {
      username: { username: datagenerator.generateStringWithAllSymbols(10) },
      password: datagenerator.generateStringWithAllSymbols(51)
    },
    description: 'В поле Логин не строка, а объект',
    status: 401,
    message: authMessages.incorrect
  },
  {
    data: {
      username: datagenerator.generateStringWithAllSymbols(50),
      password: { password: datagenerator.generateStringWithAllSymbols(10) }
    },
    description: 'В поле Пароль не строка, а объект',
    status: 401,
    message: authMessages.incorrect
  },
  {
    data: {
      password: datagenerator.getRandomBoolean()
    },
    description: 'Нет поля с Логином',
    status: 401,
    message: authMessages.incorrect
  },
  {
    data: {
      username: datagenerator.generateStringWithAllSymbols(50)
    },
    description: 'Нет поля с паролем',
    status: 401,
    message: authMessages.incorrect
  },
  {
    data: {
      field1: datagenerator.generateStringWithAllSymbols(50),
      field2: datagenerator.getRandomNumberFromInterval(1, 1000),
      field3: null,
      field4: datagenerator.getRandomBoolean(),
      field5: {
        fild51: datagenerator.getRandomNumberFromInterval(1, 1000),
        field52: datagenerator.generateStringWithAllSymbols(51)
      }
    },
    description: 'Отпправляем какой-то другой объект вместо ожидаемого',
    status: 401,
    message: authMessages.incorrect
  },
  {
    data: {
      username: '',
      password: datagenerator.generateStringWithAllSymbols(
        datagenerator.getRandomNumberFromInterval(2, 49)
      )
    },
    description: 'Пустой логин',
    status: 401,
    message: authMessages.incorrect
  },
  {
    data: {
      username: datagenerator.generateStringWithAllSymbols(
        datagenerator.getRandomNumberFromInterval(2, 49)
      ),
      password: ''
    },
    description: 'Пустой пароль',
    status: 401,
    message: authMessages.incorrect
  },
  {
    data: {
      username: '',
      password: ''
    },
    description: 'Пустые оба поля',
    status: 401,
    message: authMessages.incorrect
  },
  {
    data: {
      username: null,
      password: datagenerator.generateStringWithAllSymbols(50)
    },
    description: 'NULL в Логине',
    status: 401,
    message: authMessages.incorrect
  },
  {
    data: {
      username: null,
      password: datagenerator.generateStringWithAllSymbols(50)
    },
    description: 'NULL в Пароле',
    status: 401,
    message: authMessages.incorrect
  },
  {
    data: {
      username: null,
      password: null
    },
    description: 'NULL в обоих полях',
    status: 401,
    message: authMessages.incorrect
  },
  {
    data: {
      username: datagenerator.getRandomBoolean(),
      password: datagenerator.getRandomBoolean()
    },
    description: 'Boolean в обоих полях',
    status: 401,
    message: authMessages.incorrect
  },
  {
    data: {
      username: datagenerator.getRandomBoolean(),
      password: datagenerator.generateStringWithAllSymbols(
        datagenerator.getRandomNumberFromInterval(2, 49)
      )
    },
    description: 'Boolean в Логине',
    status: 401,
    message: authMessages.incorrect
  },
  {
    data: {
      username: datagenerator.generateStringWithAllSymbols(
        datagenerator.getRandomNumberFromInterval(2, 49)
      ),
      password: datagenerator.getRandomBoolean()
    },
    description: 'Boolean в Пароле',
    status: 401,
    message: authMessages.incorrect
  }
];
