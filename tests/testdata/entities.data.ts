import {
  MythologyEntity,
  MythologyEntityCategoryEnum,
  MythologyGetCategoryEnum,
  MythologyGetSortEnum,
} from "../../src/clients/api";
import { entetieMessages } from "../../src/data/messages";
import { DataGenerator } from "../../src/helpers/data.generator";
import { TestData } from "../../src/types/test.types";

const datagenerator = new DataGenerator();

interface Search {
  category?: MythologyGetCategoryEnum;
  sort?: MythologyGetSortEnum;
}

interface GetllTest extends TestData {
  data: Search;
}

export const correctSearch: GetllTest[] = [
  {
    data: {
      category: datagenerator.getRandomEnum(MythologyGetCategoryEnum),
      sort: MythologyGetSortEnum.Asc,
    },
    description: "Выдача случайного типа существ в ASC",
    status: 200,
  },
  {
    data: {
      category: datagenerator.getRandomEnum(MythologyGetCategoryEnum),
      sort: MythologyGetSortEnum.Desc,
    },
    description: "Выдача случайного типа существ в DESC",
    status: 200,
  },
  {
    data: {
      category: datagenerator.getRandomEnum(MythologyGetCategoryEnum),
    },
    description: "Выдача случайного типа существ без указания порядка",
    status: 200,
  },
  {
    data: {
      sort: datagenerator.getRandomEnum(MythologyGetSortEnum),
    },
    description: "Выдача в случайном порядке без указания типа существ",
    status: 200,
  },
  {
    data: {},
    description: "Выдача существ без указания порядка и сортировки",
    status: 200,
  },
];

interface CreateTest extends TestData {
  data: MythologyEntity;
}

export const createCorrectEntitie: CreateTest[] = [
  {
    data: {
      name: datagenerator.generateAlphanumeric(1),
      category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
      desc: datagenerator.generateAlphanumeric(1),
      img: datagenerator.generateAlphanumeric(1),
    },
    description: "Короткие текстовые поля",
    status: 201,
  },
  {
    data: {
      name: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(2, 50),
      ),
      category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
      desc: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(2, 50),
      ),
    },
    description: "Только обязательные поля",
    status: 201,
  },
  {
    data: {
      name: datagenerator.generateAlphanumeric(100),
      category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
      desc: datagenerator.generateAlphanumeric(1000),
      img: datagenerator.generateAlphanumeric(1000),
    },
    description:
      "Максимальное имя и достаточно большие другие текстовые поля (нет ограничений)",
    status: 201,
  },
  {
    data: {
      id: datagenerator.getRandomNumberFromInterval(32, 1000),
      name: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(2, 50),
      ),
      category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
      desc: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(2, 50),
      ),
      img: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(2, 50),
      ),
    },
    description: "Задано значение в id, ожидаем, что проигнориует",
    status: 201,
  },
];

interface IdTest extends TestData {
  data: { id: number | null | string };
}

export const incorrectID: IdTest[] = [
  {
    data: { id: datagenerator.getRandomNumberFromInterval(-1000, -1) },
    description: "ID Отрицательное число",
    status: 400,
    message: entetieMessages.incorrectID,
  },
  {
    data: { id: 0 },
    description: "ID Ноль",
    status: 400,
    message: entetieMessages.incorrectID,
  },
  {
    data: {
      id: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50),
      ),
    },
    description: "ID строка",
    status: 400,
    message: entetieMessages.incorrectID,
  },
];

export const createIncorrectEntitie: TestData[] = [
  {
    data: {
      name: datagenerator.generateAlphanumeric(101),
      category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
      desc: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50),
      ),
      img: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50),
      ),
    },
    description: "Слишком длинное имя (больше 100 символов)",
    status: 400,
  },
  {
    data: {
      category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
      desc: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50),
      ),
      img: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50),
      ),
    },
    description: "Нет обязательного поля. Имя.",
    status: 400,
    message: entetieMessages.emptyFields,
  },
  {
    data: {
      name: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50),
      ),
      desc: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50),
      ),
      img: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50),
      ),
    },
    description: "Нет обязательного поля. Категория.",
    status: 400,
    message: entetieMessages.emptyFields,
  },
  {
    data: {
      name: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50),
      ),
      category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
      img: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50),
      ),
    },
    description: "Нет обязательного поля. Описание.",
    status: 400,
  },
  {
    data: {
      field1: datagenerator.generateStringWithAllSymbols(50),
      field2: datagenerator.getRandomNumberFromInterval(1, 1000),
      field3: null,
      field4: datagenerator.getRandomBoolean(),
      field5: {
        fild51: datagenerator.getRandomNumberFromInterval(1, 1000),
        field52: datagenerator.generateStringWithAllSymbols(51),
      },
    },
    description: "Не тот объект в теле",
    status: 400,
  },
  {
    data: {
      name: datagenerator.getRandomNumberFromInterval(3, 100000),
      category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
      desc: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50),
      ),
      img: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50),
      ),
    },
    description: "Не тот тип в Имени. Число.",
    status: 400,
  },
  {
    data: {
      name: datagenerator.getRandomBoolean(),
      category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
      desc: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50),
      ),
      img: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50),
      ),
    },
    description: "Не тот тип в Имени. Boolean.",
    status: 400,
  },
  {
    data: {
      name: ["", "array", 123],
      category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
      desc: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50),
      ),
      img: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50),
      ),
    },
    description: "Не тот тип в Имени. Массив.",
    status: 400,
  },
  {
    data: {
      name: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50),
      ),
      category: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50),
      ),
      desc: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50),
      ),
      img: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50),
      ),
    },
    description: "Несуществующая категория",
    status: 400,
  },
  {
    data: {
      name: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50),
      ),
      category: datagenerator.getRandomNumberFromInterval(3, 500000),
      desc: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50),
      ),
      img: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50),
      ),
    },
    description: "Не тот тип в категории. Число",
    status: 400,
  },
  {
    data: {
      name: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50),
      ),
      category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
      desc: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50),
      ),
      img: datagenerator.getRandomNumberFromInterval(3, 50),
    },
    description: "Не тот тип в изображении. Число",
    status: 400,
  },
  {
    data: {
      name: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50),
      ),
      category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
      desc: datagenerator.getRandomNumberFromInterval(3, 50),
      img: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50),
      ),
    },
    description: "Не тот тип в описании. Число",
    status: 400,
  },
];
