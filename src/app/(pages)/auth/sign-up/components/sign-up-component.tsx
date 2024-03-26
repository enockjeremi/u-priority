"use client";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";

import { joiResolver } from "@hookform/resolvers/joi";

import useSignUp from "@/app/client/hooks/useSignUp";
import { ICredentialsToSignUp } from "@/types/auth.types";
import { Button, Input } from "@material-tailwind/react";
import { schemaSignUp } from "@/app/libs/joi/schemas";

const SignUpComponent = () => {
  const { signUpMutation, errors: signUpErrors, isLoading } = useSignUp();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICredentialsToSignUp>({
    resolver: joiResolver(schemaSignUp),
  });

  const onSubmit: SubmitHandler<ICredentialsToSignUp> = (data) => {
    const body = {
      username: data.username,
      email: data.email,
      password: data.password,
    };
    signUpMutation(body);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full sm:w-[500px] flex-col space-y-3 p-4 text-sm"
      >
        <div className="flex flex-col space-y-2">
          <Input
            {...register("username")}
            label="Nombre de usuario"
            crossOrigin={undefined}
          />
          {errors.username && (
            <p
              role="alert"
              className="text-white px-2 py-2 rounded-md bg-red-500"
            >
              {errors.username.message}
            </p>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <Input
            {...register("email")}
            label="Correo electronico"
            crossOrigin={undefined}
          />

          {errors.email && (
            <p
              role="alert"
              className="text-white px-2 py-2 rounded-md bg-red-500"
            >
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="py-1"></div>
        <div className="flex flex-col space-y-2">
          <Input
            {...register("password")}
            label="Contraseña"
            type="password"
            crossOrigin={undefined}
          />
          {errors.password && (
            <p
              role="alert"
              className="text-white px-2 py-2 rounded-md bg-red-500"
            >
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <Input
            {...register("cpassword")}
            label="Confirmar contraseña"
            type="password"
            crossOrigin={undefined}
          />
          {errors.cpassword && (
            <p
              role="alert"
              className="text-white px-2 py-2 rounded-md bg-red-500"
            >
              {errors.cpassword.message}
            </p>
          )}
        </div>
        <div className="py-1"></div>
        {signUpErrors && (
          <div className="mb-4 rounded-md bg-red-500 p-3 text-center text-white">
            {signUpErrors}
          </div>
        )}
        <div className="flex flex-col items-center justify-center space-y-1 pt-4">
          <Button
            type="submit"
            disabled={isLoading && true}
            loading={isLoading}
            placeholder={undefined}
            color="blue-gray"
            className="flex items-center justify-center mt-6"
            fullWidth
          >
            Registrar
          </Button>
          <p className="py-2 text-[12px] text-slate-500">
            <span>¿Ya tienes una cuenta? </span>
            <Link
              href={"./sign-in"}
              className={`hover:text-dark ${
                isLoading ? "pointer-events-none" : ""
              } hover:underline underline-offset-4`}
            >
              inicia sesion
            </Link>
          </p>
        </div>
      </form>
    </>
  );
};

export default SignUpComponent;
