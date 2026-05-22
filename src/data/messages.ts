export const registerMessages = {
  ok: "Регистрация успешна",
  failed: "Пользователь уже существует или ошибка БД",
  empty: "Логин и пароль обязательны."
} as const;

export const authMessages = {
  ok: "Вход выполнен успешно.",
  incorrect: "Неверные данные"
} as const;



export const entetieMessages = {
  emptyFields: "Поля name и category обязательны.",
  incorrectID: "ID должен быть положительным целым числом."
} as const;