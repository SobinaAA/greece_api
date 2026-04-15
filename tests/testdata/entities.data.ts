import {
  MythologyEntity,
  MythologyEntityCategoryEnum,
  MythologyGetCategoryEnum,
  MythologyGetSortEnum,
} from "../../src/clients/api";
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
      name: datagenerator.generateAlphanumeric(50),
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
  },
  { data: { id: 0 }, description: "ID Ноль", status: 400 },
  {
    data: {
      id: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50),
      ),
    },
    description: "ID строка",
    status: 400,
  }
];
