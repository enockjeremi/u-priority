"use client";
import { auth } from "@/app/libs/endpoints/auth";
import { navigate } from "@/app/server/actions/navigate";
import { QUERY_KEY } from "@/app/server/constants/query-keys";
import { getUserToken, saveUserToken } from "@/app/server/token/user-token";
import { UseAuthContext, User } from "@/types/auth.types";
import { ResponseError } from "@/utils/Error/response-error";
import { redirect, usePathname } from "next/navigation";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

const SIGN_IN_PATHNAME = "/auth/sign-in";
const SIGN_UP_PATHNAME = "/auth/sign-up";

type UserSignUp = {
  email: string;
  username: string;
  password: string;
};

async function signIn(email: string, password: string): Promise<any> {
  const response = await fetch(auth.login, {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new ResponseError(
      "El email o la contraseña son incorrectos.",
      response
    );
  }
  return await response.json();
}

async function signUp(body: UserSignUp): Promise<any> {
  const response = await fetch(auth.signup, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const error = (await response.json()).message;
    throw new ResponseError(error, response);
  }
  return await response.json();
}

async function getUser() {
  const token = getUserToken();
  const response = await fetch(auth.profile, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Session no iniciada.");
  }
  return await response.json();
}

const authContext = createContext({} as UseAuthContext);

export function AuthenticationProvider({ children }: { children: ReactNode }) {
  const auth: UseAuthContext = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export function useAuth() {
  return useContext(authContext);
}

function useProvideAuth() {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  useEffect(() => {
    if (success !== "" || errors !== "") {
      setTimeout(() => {
        setSuccess("");
        setErrors("");
      }, 2000);
    }
  }, [success, errors]);
  
  const { mutate: signInMutation } = useMutation<
    User,
    unknown,
    { email: string; password: string },
    unknown
  >(({ email, password }) => signIn(email, password), {
    onSuccess: async (data) => {
      saveUserToken(data.access_token);
      queryClient.setQueryData([QUERY_KEY.user], data);
      navigate("/");
    },
    onError: (error) => {
      if (error instanceof ResponseError) {
        setErrors(error.message);
      }
    },
  });

  const { mutate: signUpMutation } = useMutation<
    User,
    unknown,
    UserSignUp,
    unknown
  >((body) => signUp(body), {
    onSuccess: async (data) => {
      setSuccess("Te has registrado correctamente.");
      navigate("/auth/sign-in");
    },
    onError: async (error) => {
      if (error instanceof ResponseError) {
        setErrors(error.message);
      }
    },
  });

  const { data: user } = useQuery(
    QUERY_KEY.user,
    () =>
      pathname !== SIGN_IN_PATHNAME && pathname !== SIGN_UP_PATHNAME
        ? getUser()
        : null,
    {
      retry: 0,
    }
  );

  return {
    signInMutation,
    signUpMutation,
    user,
    errors,
    success,
  };
}