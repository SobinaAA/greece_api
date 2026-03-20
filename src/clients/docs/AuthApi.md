# AuthApi

All URIs are relative to *https://api.qasandbox.ru/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**loginPost**](#loginpost) | **POST** /login | Вход и получение токена|
|[**registerPost**](#registerpost) | **POST** /register | Регистрация нового пользователя|

# **loginPost**
> LoginPost200Response loginPost(loginPostRequest)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    LoginPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let loginPostRequest: LoginPostRequest; //

const { status, data } = await apiInstance.loginPost(
    loginPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **loginPostRequest** | **LoginPostRequest**|  | |


### Return type

**LoginPost200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Успешный вход |  -  |
|**401** | Неверные учетные данные |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **registerPost**
> registerPost(registerPostRequest)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    RegisterPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let registerPostRequest: RegisterPostRequest; //

const { status, data } = await apiInstance.registerPost(
    registerPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **registerPostRequest** | **RegisterPostRequest**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Пользователь успешно создан |  -  |
|**400** | Пользователь уже существует |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

