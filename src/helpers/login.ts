import { LoginPost200Response } from "../clients";
import { AuthService } from "../services/auth.service";
import { DataGenerator } from "./data.generator";
import { RegisterPostRequest } from "../../src/clients/api";

export async function prepareToken(creds?: RegisterPostRequest) {
  const authService = new AuthService();
  const datagenerator = new DataGenerator();

  const generatedCredentials = {
    username: datagenerator.generateStringWithAllSymbols(
      datagenerator.getRandomNumberFromInterval(1, 50)
    ),
    password: datagenerator.generateStringWithAllSymbols(
      datagenerator.getRandomNumberFromInterval(1, 50)
    ),
  };

  const credentials = { ...generatedCredentials, ...creds };

  await authService.register(credentials);
  const data = await authService.auth(credentials, 200);

  if ("token" in data) {
    return data.token;
  }

  throw new Error("Не удалось получить токен");
}