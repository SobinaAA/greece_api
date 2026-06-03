import {
  MythologyEntity,
  MythologyEntityCategoryEnum,
  MythologyGetCategoryEnum,
  MythologyGetSortEnum
} from '../../src/clients/api';
import { entetieMessages } from '../../src/data/messages';
import { DataGenerator } from '../../src/helpers/data.generator';
import { TestData } from '../../src/types/test.types';

const datagenerator = new DataGenerator();

export function createRandomEntitie(
  someFields: Partial<MythologyEntity> = {}
): MythologyEntity {
  const oneEntitie: MythologyEntity = {
    name: datagenerator.generateAlphanumeric(
      datagenerator.getRandomNumberFromInterval(3, 100)
    ),
    category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
    desc: datagenerator.generateAlphanumeric(
      datagenerator.getRandomNumberFromInterval(2, 50)
    ),
    img: datagenerator.generateAlphanumeric(
      datagenerator.getRandomNumberFromInterval(2, 50)
    )
  };
  return { ...oneEntitie, ...someFields };
}

interface Search {
  category?: MythologyGetCategoryEnum;
  sort?: MythologyGetSortEnum;
}

interface GetAllTest extends TestData {
  data: Search;
}

export const correctSearch: GetAllTest[] = [
  {
    data: {
      category: datagenerator.getRandomEnum(MythologyGetCategoryEnum),
      sort: MythologyGetSortEnum.Asc
    },
    description: 'Выдача случайного типа существ в ASC',
    status: 200
  },
  {
    data: {
      category: datagenerator.getRandomEnum(MythologyGetCategoryEnum),
      sort: MythologyGetSortEnum.Desc
    },
    description: 'Выдача случайного типа существ в DESC',
    status: 200
  },
  {
    data: {
      category: datagenerator.getRandomEnum(MythologyGetCategoryEnum)
    },
    description: 'Выдача случайного типа существ без указания порядка',
    status: 200
  },
  {
    data: {
      sort: datagenerator.getRandomEnum(MythologyGetSortEnum)
    },
    description: 'Выдача в случайном порядке без указания типа существ',
    status: 200
  },
  {
    data: {},
    description: 'Выдача существ без указания порядка и сортировки',
    status: 200
  }
];

type incorrectSearchFields = {
  category: string;
  sort: string;
};

interface SearchWithIncorrect extends TestData {
  data: incorrectSearchFields;
}

export const incorrectSearch: SearchWithIncorrect[] = [
  {
    data: {
      category: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(2, 50)
      ),
      sort: datagenerator.getRandomEnum(MythologyGetSortEnum)
    },
    description: 'Вывод всех с некорректной категорией',
    status: 200
  },
  {
    data: {
      category: datagenerator.getRandomEnum(MythologyGetCategoryEnum),
      sort: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(2, 5)
      )
    },
    description: 'Вывод всех в некорректном порядке',
    status: 200
  }
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
      img: datagenerator.generateAlphanumeric(1)
    },
    description: 'Короткие текстовые поля',
    status: 201
  },
  {
    data: {
      name: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(2, 50)
      ),
      category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
      desc: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(2, 50)
      )
    },
    description: 'Только обязательные поля',
    status: 201
  },
  {
    data: {
      name: datagenerator.generateAlphanumeric(100),
      category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
      desc: datagenerator.generateAlphanumeric(1000),
      img: datagenerator.generateAlphanumeric(1000)
    },
    description:
      'Максимальное имя и достаточно большие другие текстовые поля (нет ограничений)',
    status: 201
  },
  {
    data: {
      id: datagenerator.getRandomNumberFromInterval(32, 1000),
      name: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(2, 50)
      ),
      category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
      desc: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(2, 50)
      ),
      img: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(2, 50)
      )
    },
    description: 'Задано значение в id, ожидаем, что проигнориует',
    status: 201
  }
];

interface IdTest extends TestData {
  data: { id: number | null | string };
}

export const incorrectID: IdTest[] = [
  {
    data: { id: datagenerator.getRandomNumberFromInterval(-1000, -1) },
    description: 'ID Отрицательное число',
    status: 400,
    message: entetieMessages.incorrectID
  },
  {
    data: { id: 0 },
    description: 'ID Ноль',
    status: 400,
    message: entetieMessages.incorrectID
  },
  {
    data: {
      id: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50)
      )
    },
    description: 'ID строка',
    status: 400,
    message: entetieMessages.incorrectID
  }
];

export const createIncorrectEntitie: TestData[] = [
  {
    data: {
      name: datagenerator.generateAlphanumeric(101),
      category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
      desc: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50)
      ),
      img: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50)
      )
    },
    description: 'Слишком длинное имя (больше 100 символов)',
    status: 400
  },
  {
    data: {
      category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
      desc: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50)
      ),
      img: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50)
      )
    },
    description: 'Нет обязательного поля. Имя.',
    status: 400,
    message: entetieMessages.emptyFields
  },
  {
    data: {
      name: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50)
      ),
      desc: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50)
      ),
      img: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50)
      )
    },
    description: 'Нет обязательного поля. Категория.',
    status: 400,
    message: entetieMessages.emptyFields
  },
  {
    data: {
      name: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50)
      ),
      category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
      img: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50)
      )
    },
    description: 'Нет обязательного поля. Описание.',
    status: 400
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
    description: 'Не тот объект в теле',
    status: 400
  },
  {
    data: {
      name: datagenerator.getRandomNumberFromInterval(3, 100000),
      category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
      desc: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50)
      ),
      img: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50)
      )
    },
    description: 'Не тот тип в Имени. Число.',
    status: 400
  },
  {
    data: {
      name: datagenerator.getRandomBoolean(),
      category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
      desc: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50)
      ),
      img: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50)
      )
    },
    description: 'Не тот тип в Имени. Boolean.',
    status: 400
  },
  {
    data: {
      name: ['', 'array', 123],
      category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
      desc: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50)
      ),
      img: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50)
      )
    },
    description: 'Не тот тип в Имени. Массив.',
    status: 400
  },
  {
    data: {
      name: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50)
      ),
      category: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50)
      ),
      desc: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50)
      ),
      img: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50)
      )
    },
    description: 'Несуществующая категория',
    status: 400
  },
  {
    data: {
      name: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50)
      ),
      category: datagenerator.getRandomNumberFromInterval(3, 500000),
      desc: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50)
      ),
      img: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50)
      )
    },
    description: 'Не тот тип в категории. Число',
    status: 400
  },
  {
    data: {
      name: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50)
      ),
      category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
      desc: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50)
      ),
      img: datagenerator.getRandomNumberFromInterval(3, 50)
    },
    description: 'Не тот тип в изображении. Число',
    status: 400
  },
  {
    data: {
      name: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50)
      ),
      category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
      desc: datagenerator.getRandomNumberFromInterval(3, 50),
      img: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50)
      )
    },
    description: 'Не тот тип в описании. Число',
    status: 400
  }
];

interface PatchTest extends TestData {
  data: Partial<MythologyEntity>;
}

export const correctPatchTest: PatchTest[] = [
  {
    data: {
      name: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 100)
      ),
      category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum),
      desc: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(2, 50)
      ),
      img: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(2, 50)
      )
    },
    description: 'Полное обновление сущности',
    status: 200
  },
  {
    data: {
      name: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(3, 50)
      )
    },
    description: 'Обновление имени',
    status: 200
  },
  {
    data: {
      category: datagenerator.getRandomEnum(MythologyEntityCategoryEnum)
    },
    description: 'Обновление категории',
    status: 200
  },
  {
    data: {
      desc: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(2, 50)
      )
    },
    description: 'Обновление описания',
    status: 200
  },
  {
    data: {
      img: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(2, 50)
      )
    },
    description: 'Обновление изображения',
    status: 200
  }
];

export const incorrectPatchTest: TestData[] = [
  {
    data: {
      name: datagenerator.generateAlphanumeric(101)
    },
    description: 'Обновление имени слишком длинным значением',
    status: 400
  },
  {
    data: {
      field: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(2, 50)
      )
    },
    description: 'Не то поле (не из объекта)',
    status: 400
  },
  {
    data: {
      category: datagenerator.generateAlphanumeric(
        datagenerator.getRandomNumberFromInterval(2, 50)
      )
    },
    description: 'Заполнение категории не тем значением',
    status: 400
  },
  {
    data: {
      category: datagenerator.getRandomNumberFromInterval(2, 50)
    },
    description: 'Заполнение категории не тем типом данных',
    status: 400
  },
  {
    data: {
      name: datagenerator.getRandomNumberFromInterval(2, 50)
    },
    description: 'Заполнение имени не тем типом данных',
    status: 400
  },
  {
    data: {
      desc: datagenerator.getRandomNumberFromInterval(2, 50)
    },
    description: 'Заполнение описания не тем типом данных',
    status: 400
  },
  {
    data: {
      img: datagenerator.getRandomNumberFromInterval(2, 50)
    },
    description: 'Заполнение картинки не тем типом данных',
    status: 400
  }
];
