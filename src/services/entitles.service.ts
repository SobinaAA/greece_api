import { AxiosError, AxiosResponse } from "axios";
import assert from "assert";
import {
  EntitiesApi,
  MythologyEntity,
  MythologyGetCategoryEnum,
  MythologyGetSortEnum,
  MythologyIdPatchRequest,
} from "../clients/api";
import { ApiResponse } from "../types/apiResponse.types.ts";


//Сервис немного доработан, так как почему-то в EntitiesApi указано, что получаем T, а не ApiResponse<T> (хотя видно по запросам - это не так)
export class EntitiesService {
  constructor(private api: EntitiesApi) {}

  private async request<T>(
    requestFn: () => Promise<AxiosResponse<any>>,
    expectedStatus?: number
  ): Promise<ApiResponse<T>> {
    let response: AxiosResponse<any>;

    try {
      response = await requestFn();
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      if (axiosError.response) {
        response = axiosError.response;
      } else {
        throw error;
      }
    }

    if (expectedStatus !== undefined) {
      assert.equal(
        response.status,
        expectedStatus,
        `Ожидался статус ${expectedStatus}, но получен ${response.status}`
      );
    }

    const body = response.data;

    if (
      body &&
      typeof body === "object" &&
      "success" in body &&
      "message" in body &&
      "data" in body
    ) {
      return body as ApiResponse<T>;
    }

    // ⚠️ fallback (если клиент реально вернул T)
    return {
      success: true,
      message: "OK (wrapped by service)",
      data: body as T,
    };
  }

  async getAll(
    category?: MythologyGetCategoryEnum,
    sort?: MythologyGetSortEnum,
    expectedStatus?: number
  ): Promise<ApiResponse<MythologyEntity[]>> {
    return this.request(
      () => this.api.mythologyGet(category, sort),
      expectedStatus
    );
  }

  async create(
    entity: MythologyEntity,
    expectedStatus?: number
  ): Promise<ApiResponse<MythologyEntity>> {
    return this.request(() => this.api.mythologyPost(entity), expectedStatus);
  }

  async update(
    id: number,
    entity: MythologyEntity,
    expectedStatus?: number
  ): Promise<ApiResponse<MythologyEntity>> {
    return this.request(
      () => this.api.mythologyIdPut(id, entity),
      expectedStatus
    );
  }

  async patch(
    id: number,
    entity: MythologyIdPatchRequest,
    expectedStatus?: number
  ): Promise<ApiResponse<MythologyEntity>> {
    return this.request(
      () => this.api.mythologyIdPatch(id, entity),
      expectedStatus
    );
  }

  async delete(
    id: number,
    expectedStatus?: number
  ): Promise<ApiResponse<null>> {
    return this.request(() => this.api.mythologyIdDelete(id), expectedStatus);
  }
}
