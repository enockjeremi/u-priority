export type ICredentialsToSignIn = {
  email: string;
  password: string;
};

export type ICredentialsToSignUp = {
  email: string;
  username: string;
  password: string;
  cpassword?: string;
};

export interface IUser {
  access_token: string;
  user: {
    email: string;
    id: number;
    role: string;
  };
}
