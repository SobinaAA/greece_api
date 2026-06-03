import assert from 'assert';
import { AxiosResponse, AxiosError } from 'axios';
import { AuthApi, LoginPostRequest, RegisterPostRequest } from '../clients';
import {
  RegisterResponseSuccess,
  RegisterResponseUnsuccess,
  AuthResponseSuccess,
  AuthResponseUnsuccess
} from '../types/apiResponse.types';

export class AuthService {
  private api = new AuthApi();

  async register(
    credentials: RegisterPostRequest,
    expectedStatus?: number
  ): Promise<RegisterResponseSuccess | RegisterResponseUnsuccess> {
    let response: AxiosResponse;

    try {
      response = await this.api.registerPost(credentials);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        response = axiosError.response;
      } else {
        throw error;
      }
    }

    if (expectedStatus !== undefined) {
      assert.equal(response.status, expectedStatus);
    }

    return response.data;
  }

  async auth(
    credentials: LoginPostRequest,
    expectedStatus?: number
  ): Promise<AuthResponseSuccess | AuthResponseUnsuccess> {
    let response: AxiosResponse;

    try {
      response = await this.api.loginPost(credentials);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        response = axiosError.response;
      } else {
        throw error;
      }
    }

    if (expectedStatus !== undefined) {
      assert.equal(response.status, expectedStatus);
    }

    return response.data;
  }
}
