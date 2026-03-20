import { LoginPost200Response } from "../clients";
import { AuthService } from "../services/auth.service";
import { ApiResponse } from "../types/apiResponse.types.ts";
import { DataGenerator } from "./data.generator";
import { RegisterPostRequest } from "../../src/clients/api";

export async function prepareToken(creds?: RegisterPostRequest) {
  const authService = new AuthService();
  const datagenerator = new DataGenerator();

  const generatedCredentials: RegisterPostRequest = {
    username: datagenerator.generateStringWithAllSymbols(
      datagenerator.getRandomNumberFromInterval(1, 50)
    ),
    password: datagenerator.generateStringWithAllSymbols(
      datagenerator.getRandomNumberFromInterval(1, 50)
    ),
  };

  const credentials: RegisterPostRequest = {
    ...generatedCredentials,
    ...creds,
  };

  await authService.register(credentials);
  const data = await authService.auth(credentials, 200);
  const data200 = data as ApiResponse<LoginPost200Response>;
  return data200.data?.token;
}
