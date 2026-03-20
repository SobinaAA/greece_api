# EntitiesApi

All URIs are relative to *https://api.qasandbox.ru/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**mythologyGet**](#mythologyget) | **GET** /mythology | Получить список всех сущностей|
|[**mythologyIdDelete**](#mythologyiddelete) | **DELETE** /mythology/{id} | Изгнать сущность (удаление)|
|[**mythologyIdPatch**](#mythologyidpatch) | **PATCH** /mythology/{id} | Частичное обновление сущности|
|[**mythologyIdPut**](#mythologyidput) | **PUT** /mythology/{id} | Полное обновление сущности|
|[**mythologyPost**](#mythologypost) | **POST** /mythology | Призвать новую сущность|

# **mythologyGet**
> Array<MythologyEntity> mythologyGet()


### Example

```typescript
import {
    EntitiesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EntitiesApi(configuration);

let category: 'all' | 'gods' | 'heroes' | 'creatures'; //Фильтрация по категории. Используйте \'all\' для всех. (optional) (default to undefined)
let sort: 'asc' | 'desc'; //Сортировка по имени (asc — А-Я, desc — Я-А) (optional) (default to undefined)

const { status, data } = await apiInstance.mythologyGet(
    category,
    sort
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **category** | [**&#39;all&#39; | &#39;gods&#39; | &#39;heroes&#39; | &#39;creatures&#39;**]**Array<&#39;all&#39; &#124; &#39;gods&#39; &#124; &#39;heroes&#39; &#124; &#39;creatures&#39;>** | Фильтрация по категории. Используйте \&#39;all\&#39; для всех. | (optional) defaults to undefined|
| **sort** | [**&#39;asc&#39; | &#39;desc&#39;**]**Array<&#39;asc&#39; &#124; &#39;desc&#39;>** | Сортировка по имени (asc — А-Я, desc — Я-А) | (optional) defaults to undefined|


### Return type

**Array<MythologyEntity>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Список получен |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **mythologyIdDelete**
> mythologyIdDelete()


### Example

```typescript
import {
    EntitiesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EntitiesApi(configuration);

let id: number; //ID сущности (Внимание! ID 1-31 защищены от правок) (default to undefined)

const { status, data } = await apiInstance.mythologyIdDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | ID сущности (Внимание! ID 1-31 защищены от правок) | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Успешное удаление (нет содержимого) |  -  |
|**403** | Запрещено удалять системных персонажей |  -  |
|**404** | Не найдено |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **mythologyIdPatch**
> MythologyEntity mythologyIdPatch()


### Example

```typescript
import {
    EntitiesApi,
    Configuration,
    MythologyIdPatchRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new EntitiesApi(configuration);

let id: number; //ID сущности (Внимание! ID 1-31 защищены от правок) (default to undefined)
let mythologyIdPatchRequest: MythologyIdPatchRequest; // (optional)

const { status, data } = await apiInstance.mythologyIdPatch(
    id,
    mythologyIdPatchRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **mythologyIdPatchRequest** | **MythologyIdPatchRequest**|  | |
| **id** | [**number**] | ID сущности (Внимание! ID 1-31 защищены от правок) | defaults to undefined|


### Return type

**MythologyEntity**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Поля обновлены |  -  |
|**400** | Нет полей для обновления |  -  |
|**403** | Запрещено! Системная блокировка |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **mythologyIdPut**
> MythologyEntity mythologyIdPut(mythologyEntity)


### Example

```typescript
import {
    EntitiesApi,
    Configuration,
    MythologyEntity
} from './api';

const configuration = new Configuration();
const apiInstance = new EntitiesApi(configuration);

let id: number; //ID сущности (Внимание! ID 1-31 защищены от правок) (default to undefined)
let mythologyEntity: MythologyEntity; //

const { status, data } = await apiInstance.mythologyIdPut(
    id,
    mythologyEntity
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **mythologyEntity** | **MythologyEntity**|  | |
| **id** | [**number**] | ID сущности (Внимание! ID 1-31 защищены от правок) | defaults to undefined|


### Return type

**MythologyEntity**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Успешно обновлено |  -  |
|**403** | Запрещено! Системная блокировка |  -  |
|**404** | Не найдено |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **mythologyPost**
> MythologyEntity mythologyPost(mythologyEntity)


### Example

```typescript
import {
    EntitiesApi,
    Configuration,
    MythologyEntity
} from './api';

const configuration = new Configuration();
const apiInstance = new EntitiesApi(configuration);

let mythologyEntity: MythologyEntity; //

const { status, data } = await apiInstance.mythologyPost(
    mythologyEntity
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **mythologyEntity** | **MythologyEntity**|  | |


### Return type

**MythologyEntity**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Сущность создана |  -  |
|**401** | Нужен токен авторизации |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

