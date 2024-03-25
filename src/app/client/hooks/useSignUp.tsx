import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";

import { navigate } from "@/app/server/actions/navigate";
import { QUERY_KEY_USERS } from "@/app/server/constants/query-keys";

import { ResponseError } from "@/utils/Error/response-error";

import { auth } from "@/app/libs/endpoints/auth";
import { ICredentialsToSignUp, IUser } from "@/types/auth.types";

async function signUp(body: ICredentialsToSignUp): Promise<IUser> {
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

const useSignUp = () => {
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const successMessage = (message = "") => setSuccess(message);
  const errosMessage = (message = "") => setErrors(message);

  const { mutate: signUpMutation, isLoading } = useMutation<
    IUser,
    unknown,
    ICredentialsToSignUp,
    unknown
  >((body) => signUp(body), {
    onSuccess: async (data) => {
      queryClient.setQueryData([QUERY_KEY_USERS.user], data);
      successMessage("Te has registrado correctamente.");
      navigate("/auth/sign-in");
    },
    onError: async (error) => {
      if (error instanceof ResponseError) {
        errosMessage(error.message);
      }
    },
  });

  return {
    signUpMutation,
    isLoading,
    errors,
    success,
  };
};

export default useSignUp;
