import { RegisterPostRequest } from "../../src/clients/api";
import { DataGenerator } from "../../src/helpers/data.generator";

const datagenerator = new DataGenerator();

interface UserTest {
  credentials: RegisterPostRequest;
  description: string;
}

interface BrokenUserTest {
  credentials: object;
  description: string;
}

export const correctRegisterUserData: UserTest[] = [
  {
    credentials: {
      username: datagenerator.generateAlphanumeric(1),
      password: datagenerator.generateAlphanumeric(1),
    },
    description: "1-symbol credentials (Alphanumeric)",
  },
  {
    credentials: {
      username: datagenerator.generateStringWithAllSymbols(
        datagenerator.getRandomNumberFromInterval(2, 49)
      ),
      password: datagenerator.generateStringWithAllSymbols(
        datagenerator.getRandomNumberFromInterval(2, 49)
      ),
    },
    description: "Random length of fields",
  },
  {
    credentials: {
      username: datagenerator.generateStringWithAllSymbols(50),
      password: datagenerator.generateStringWithAllSymbols(50),
    },
    description: "Max-symbols username (generateStringWithAllSymbols)",
  },
  {
    credentials: {
      username: datagenerator.generateStringWithAllSymbols(50),
      password: datagenerator.generateStringWithAllSymbols(214),
    },
    description: "LARGE-symbols password (generateStringWithAllSymbols)",
  },
];

export const IncorrectRegisterUserData: BrokenUserTest[] = [
  {
    credentials: {
      username: datagenerator.generateStringWithAllSymbols(51),
      password: datagenerator.getRandomNumberFromInterval(1, 100000),
    },
    description: "Numbers in PASSWORD field",
  },
  {
    credentials: {
      username: datagenerator.getRandomNumberFromInterval(1, 100000), //Зарегистрирован пользователь
      password: datagenerator.generateStringWithAllSymbols(51),
    },
    description: "Numbers in USERNAME field",
  },
  {
    credentials: {
      username: datagenerator.getRandomBoolean(),
      password: datagenerator.getRandomBoolean(),
    },
    description: "Boolean in both fields",
  },
  {
    credentials: {
      username: datagenerator.generateStringWithAllSymbols(51),
      password: [datagenerator.generateStringWithAllSymbols(10)],
    },
    description: "Array in PASSWORD field",
  },
  {
    credentials: {
      username: [datagenerator.generateStringWithAllSymbols(10)],
      password: datagenerator.generateStringWithAllSymbols(51),
    },
    description: "Array in USERNAME field",
  },
  {
    credentials: {
      username: { username: datagenerator.generateStringWithAllSymbols(10) },
      password: datagenerator.generateStringWithAllSymbols(51),
    },
    description: "Object in USERNAME field",
  },
  {
    credentials: {
      username: datagenerator.generateStringWithAllSymbols(51),
      password: { password: datagenerator.generateStringWithAllSymbols(10) },
    },
    description: "Object in PASSWORD field",
  },
];

export const brokenRegisterUserData: BrokenUserTest[] = [
  {
    credentials: {
      password: datagenerator.getRandomBoolean(),
    },
    description: "No username field",
  },
  {
    credentials: {
      username: datagenerator.generateStringWithAllSymbols(51),
    },
    description: "No password field",
  },
  {
    credentials: {
      field1: datagenerator.generateStringWithAllSymbols(51),
      field2: datagenerator.getRandomNumberFromInterval(1, 1000),
      field3: null,
      field4: datagenerator.getRandomBoolean(),
      field5: {
        fild51: 12,
        field52: "Молоко",
      },
    },
    description: "Strange object with different fields",
  },
];

export const emptyRegisterUserData: BrokenUserTest[] = [
  {
    credentials: {
      username: "",
      password: datagenerator.generateStringWithAllSymbols(
        datagenerator.getRandomNumberFromInterval(2, 49)
      ),
    },
    description: "Empty username",
  },
  {
    credentials: {
      username: datagenerator.generateStringWithAllSymbols(
        datagenerator.getRandomNumberFromInterval(2, 49)
      ),
      password: "",
    },
    description: "Empty password",
  },
  {
    credentials: {
      username: "",
      password: "",
    },
    description: "Empty both fields",
  },
  {
    credentials: {
      username: null,
      password: datagenerator.generateStringWithAllSymbols(51),
    },
    description: "NULL USERNAME field",
  },
  {
    credentials: {
      username: null,
      password: datagenerator.generateStringWithAllSymbols(51),
    },
    description: "NULL USERNAME field",
  },
  {
    credentials: {
      username: null,
      password: null,
    },
    description: "NULL in both fields",
  },
];
