import { useState } from "react";
import { UseMutateFunction, useMutation, useQueryClient } from "react-query";

import { navigate } from "@/app/server/actions/navigate";
import { QUERY_KEY } from "@/app/server/constants/query-keys";
import { saveUserToken } from "@/app/server/token/user-token";

import { ResponseError } from "@/utils/Error/response-error";

import { auth } from "@/app/libs/endpoints/auth";
import { User } from "@/types/auth.types";

async function signIn(
  email: string,
  password: string,
  setIsLoading: any
): Promise<any> {
  setIsLoading(true);
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
const useSignIn = () => {
  const [errors, setErrors] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const errosMessage = (message = "") => setErrors(message);

  const queryClient = useQueryClient();
  const { mutate: signInMutation } = useMutation<
    User,
    unknown,
    { email: string; password: string },
    unknown
  >(({ email, password }) => signIn(email, password, setIsLoading), {
    onSuccess: async (data) => {
      saveUserToken(data.access_token);
      queryClient.setQueryData([QUERY_KEY.user], data.user);
      navigate("/");
    },
    onError: (error) => {
      if (error instanceof ResponseError) {
        errosMessage(error.message);
      }
    },
  });

  return {
    signInMutation,
    errors,
    isLoading,
  };
};

export default useSignIn;
