"use client";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import Joi from "joi";

import { esErrors } from "@/utils/joi-es-errors";
import { joiResolver } from "@hookform/resolvers/joi";

import useSignUp from "@/app/client/hooks/useSignUp";
import { ICredentialsToSignUp } from "@/types/auth.types";
import { Input, Typography } from "@material-tailwind/react";

const schema = Joi.object({
  email: Joi.string()
    .required()
    .messages(esErrors)
    .email({ tlds: { allow: false } }),
  username: Joi.string().required().messages(esErrors),
  password: Joi.string().required().min(7).messages(esErrors),
  cpassword: Joi.any().valid(Joi.ref("password")).required().messages(esErrors),
});

const SignUpComponent = () => {
  const { signUpMutation, errors: signUpErrors, isLoading } = useSignUp();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICredentialsToSignUp>({
    resolver: joiResolver(schema),
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
          <button
            disabled={isLoading && true}
            className={`${
              isLoading && "cursor-not-allow hover:bg-black/30"
            } w-full rounded-md bg-primary px-2 py-2 uppercase text-white duration-150 hover:bg-black/90`}
          >
            {isLoading ? "cargando.. " : "Registrar"}
          </button>

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

        {/*
        {message && (
          <div className="rounded-md bg-red-500 p-3 text-center text-white">
            {message}
          </div>
        )} */}
      </form>
    </>
  );
};

export default SignUpComponent;
