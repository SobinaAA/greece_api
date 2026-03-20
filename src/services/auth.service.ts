import { AuthApi, LoginPost200Response, LoginPostRequest, ModelError, RegisterPostRequest } from "../clients/api";

import { AxiosResponse, AxiosError } from "axios";
import { strict as assert } from "assert";
import { ApiResponse } from "../types/apiResponse.types.ts";

export class AuthService {

  private api = new AuthApi();

  /**
   * Регистрирует пользователя.
   * @param credentials данные для регистрации
   * @param expectedStatus если указан, проверяет, что статус совпадает
   * @returns объект с типом RegisterResponse
   */
  async register(
    credentials: RegisterPostRequest,
    expectedStatus?: number
  ): Promise<ApiResponse<null>> {
    let response: AxiosResponse<ApiResponse<null>>;

    try {
      response = await this.api.registerPost(credentials) as unknown as AxiosResponse<ApiResponse<null>>;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<null>>;
      if (axiosError.response) {
        response = axiosError.response;
      } else {
        throw error; 
      }
    }

    if (expectedStatus !== undefined) {
      assert.equal(response.status, expectedStatus, `Ожидался статус ${expectedStatus}, но получен ${response.status}`);
    }

    return response.data;
  }


  /**
   * Авторизуется пользователем.
   * @param credentials данные для авторизации
   * @param expectedStatus если указан, проверяет, что статус совпадает
   * @returns объект с ошибкой или токеном (error или token)
   */
  async auth(
    credentials: LoginPostRequest,
    expectedStatus?: number
  ): Promise<ApiResponse<LoginPost200Response | ModelError>> {
    let response: AxiosResponse<ApiResponse<LoginPost200Response | ModelError>>;

    try {
      response = await this.api.loginPost(credentials) as unknown as AxiosResponse<ApiResponse<LoginPost200Response | ModelError>>;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<LoginPost200Response | ModelError>>;
      if (axiosError.response) {
        response = axiosError.response;
      } else {
        throw error; 
      }
    }

    if (expectedStatus !== undefined) {
      assert.equal(response.status, expectedStatus, `Ожидался статус ${expectedStatus}, но получен ${response.status}`);
    }

    return response.data;
  }


}