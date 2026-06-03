# MythologyEntity

## Properties

| Name         | Type       | Description                         | Notes                                        |
| ------------ | ---------- | ----------------------------------- | -------------------------------------------- |
| **id**       | **number** |                                     | [optional] [readonly] [default to undefined] |
| **name**     | **string** |                                     | [default to undefined]                       |
| **category** | **string** |                                     | [default to undefined]                       |
| **desc**     | **string** | Содержимое колонки description в БД | [default to undefined]                       |
| **img**      | **string** |                                     | [optional] [default to undefined]            |

## Example

```typescript
import { MythologyEntity } from './api';

const instance: MythologyEntity = {
  id,
  name,
  category,
  desc,
  img
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
