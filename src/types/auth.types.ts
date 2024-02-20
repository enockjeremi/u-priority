export type CredentialsToSignIn = {
  email: string;
  password: string;
};

export type CredentialsToSignUp = {
  email: string;
  username: string;
  password: string;
  cpassword: string;
};

export interface User {
  access_token: string;
  user: {
    email: string;
    id: number;
    role: string;
  };
}

export interface UseAuthContext {
  signInMutation: any;
  user: any
}
