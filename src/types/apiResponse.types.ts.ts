export interface AuthResponseSuccess {
  token: string;
}

export interface AuthResponseUnsuccess {
  error: string;
}

export interface RegisterResponseSuccess {
  message: string;
}

export interface RegisterResponseUnsuccess {
  error: string;
}