import { API_URL } from "../../enviroments";

export const auth = {
  login: `${API_URL}/auth/login`,
  signup: `${API_URL}/users/`,
  profile: `${API_URL}/auth/profile`,
  verifyPassword: `${API_URL}/users/compare-password`,
  changePassword: (id: number) => `${API_URL}/users/${id}`,
};
