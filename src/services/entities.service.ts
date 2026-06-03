import assert from 'assert';
import { AxiosResponse, AxiosError } from 'axios';
import {
  EntitiesApi,
  MythologyGetCategoryEnum,
  MythologyGetSortEnum,
  MythologyEntity,
  MythologyIdPatchRequest
} from '../clients';

export class EntitiesService {
  constructor(private api: EntitiesApi) {}

  private async request<T>(
    requestFn: () => Promise<AxiosResponse<T>>,
    expectedStatus?: number
  ): Promise<T> {
    let response: AxiosResponse<T>;

    try {
      response = await requestFn();
    } catch (error) {
      const axiosError = error as AxiosError<T>;
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

  async getAll(
    category?: MythologyGetCategoryEnum,
    sort?: MythologyGetSortEnum,
    expectedStatus?: number
  ): Promise<MythologyEntity[]> {
    return this.request(
      () => this.api.mythologyGet(category, sort),
      expectedStatus
    );
  }

  async getById(id: number, expectedStatus?: number): Promise<MythologyEntity> {
    return this.request(() => this.api.mythologyIdGet(id), expectedStatus);
  }

  async create(entity: MythologyEntity, expectedStatus?: number) {
    return this.request(() => this.api.mythologyPost(entity), expectedStatus);
  }

  async update(id: number, entity: MythologyEntity, expectedStatus?: number) {
    return this.request(
      () => this.api.mythologyIdPut(id, entity),
      expectedStatus
    );
  }

  async patch(
    id: number,
    entity: MythologyIdPatchRequest,
    expectedStatus?: number
  ) {
    return this.request(
      () => this.api.mythologyIdPatch(id, entity),
      expectedStatus
    );
  }

  async delete(id: number, expectedStatus?: number): Promise<void> {
    await this.request(() => this.api.mythologyIdDelete(id), expectedStatus);
  }
}
