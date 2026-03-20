import { MythologyEntity } from "../clients";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null; 
}

export interface AuthResponseSuccess {
  token: string
};

export interface AuthResponseUnsuccess {
  error: string
};

export type MythologyEntities = MythologyEntity[];