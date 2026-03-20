import {
  MythologyEntity,
  MythologyGetCategoryEnum,
  MythologyGetSortEnum,
} from "../../src/clients/api";
import { DataGenerator } from "../../src/helpers/data.generator";

const datagenerator = new DataGenerator();

interface EntitieTest {
  characretistics: MythologyEntity;
  description: string;
}

interface Search {
  category?: MythologyGetCategoryEnum;
  sort?: MythologyGetSortEnum;
}
interface GetllTest {
  parameters: Search;
  description: string;
}

export const correctSearch: GetllTest[] = [
    {parameters: {
        category: datagenerator.getRandomEnum(MythologyGetCategoryEnum),
        sort: MythologyGetSortEnum.Asc
    },
    description: "Выдача случайного типа существ в ASC"
    },
    {parameters: {
        category: datagenerator.getRandomEnum(MythologyGetCategoryEnum),
        sort: MythologyGetSortEnum.Desc
    },
    description: "Выдача случайного типа существ в DESC"
    },
    {parameters: {
        category: datagenerator.getRandomEnum(MythologyGetCategoryEnum)
    },
    description: "Выдача случайного типа существ без указания порядка"
    },    
    {parameters: {
        sort: datagenerator.getRandomEnum(MythologyGetSortEnum)
    },
    description: "Выдача в случайном порядке без указания типа существ"
    },    
    {parameters: {
    },
    description: "Выдача существ без указания порядка и сортировки"
    }
];
