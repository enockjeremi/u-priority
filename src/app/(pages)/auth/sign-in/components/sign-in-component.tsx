"use client";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";

import { joiResolver } from "@hookform/resolvers/joi";

import useSignIn from "@/app/client/hooks/useSignIn";

import { ICredentialsToSignIn } from "@/types/auth.types";
import { Button, Input } from "@material-tailwind/react";
import { schemaSignIn } from "@/app/libs/joi/schemas";

const SignInComponent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICredentialsToSignIn>({
    resolver: joiResolver(schemaSignIn),
    defaultValues: {
      email: "enockjeremi@gmail.com",
      password: "23443069",
    },
  });

  const { signInMutation, errors: signInErrors, isLoading } = useSignIn();
  const onSubmit: SubmitHandler<ICredentialsToSignIn> = (data) => {
    const { email, password } = data;
    signInMutation({ email, password });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col space-y-3 p-4 text-sm sm:w-[500px]"
      >
        <div className="flex w-full flex-col space-y-2">
          <Input {...register("email")} label="Email" crossOrigin={undefined} />

          {errors.email && (
            <p
              role="alert"
              className="rounded-md bg-red-500 px-2 py-2 text-white"
            >
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="-full flex flex-col space-y-2">
          <Input
            {...register("password")}
            type="password"
            label="Contraseña"
            crossOrigin={undefined}
          />

          {errors.password && (
            <p
              role="alert"
              className="rounded-md bg-red-500 px-2 py-2 text-white"
            >
              {errors.password.message}
            </p>
          )}
        </div>
        {signInErrors && (
          <div className="mb-4 rounded-md bg-red-500 p-3 text-center text-white">
            {signInErrors}
          </div>
        )}
        <div className="flex flex-col items-center justify-center space-y-1 pt-4">
          <Button
            type="submit"
            disabled={isLoading && true}
            loading={isLoading}
            size="sm"
            placeholder={undefined}
            color="blue-gray"
            fullWidth
            className="flex items-center justify-center"
          >
            ingresar
          </Button>

          <p className="text-slate-500 py-2 text-[12px]">
            <span>¿No tienes una cuenta? </span>
            <Link
              href={"./sign-up"}
              className={`hover:text-dark ${
                isLoading ? "pointer-events-none" : ""
              } underline-offset-4 hover:underline`}
            >
              registrate
            </Link>
          </p>
        </div>
      </form>
    </>
  );
};

export default SignInComponent;
