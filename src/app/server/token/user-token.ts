import Cookies from "js-cookie";
import { USER_TOKEN_EXPIRE, USER_TOKEN_NAME } from "../constants/user-token";

export function saveUserToken(token: string): void {
  Cookies.set(USER_TOKEN_NAME, token, { expires: USER_TOKEN_EXPIRE });
}

export function getUserToken() {
  const user_token = Cookies.get(USER_TOKEN_NAME);
  return user_token ? user_token : null;
}

export function removeUserToken(): void {
  Cookies.remove(USER_TOKEN_NAME);
}
