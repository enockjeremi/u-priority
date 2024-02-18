"use client";
import { esErrors } from "@/utils/joi-es-errors";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import Link from "next/link";
import React, { FormEvent } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const schema = Joi.object({
  email: Joi.string()
    .required()
    .messages(esErrors)
    .email({ tlds: { allow: false } }),
  username: Joi.string().required().messages(esErrors),
  password: Joi.string().required().min(7).messages(esErrors),
  cpassword: Joi.any().valid(Joi.ref("password")).required().messages(esErrors),
});

type CredentialsToSignUp = {
  email: string;
  username: string;
  password: string;
  cpassword: string;
};

const SignUpComponent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CredentialsToSignUp>({
    resolver: joiResolver(schema),
  });

  const onSubmit: SubmitHandler<CredentialsToSignUp> = (data) => {};

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full sm:w-[500px] flex-col space-y-3 p-4 text-sm"
      >
        <div className="flex flex-col space-y-2">
          <label htmlFor="username_label">Nombre de usuario:</label>
          <input
            {...register("username")}
            type="text"
            id="username_label"
            name="username"
            className="rounded-md border border-gray-400 px-2 py-1"
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
          <label htmlFor="email_label">Email:</label>
          <input
            {...register("email")}
            id="email_label"
            type="email"
            name="email"
            className="rounded-md border border-gray-400 px-2 py-1"
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
          <label htmlFor="password">Contraseña:</label>
          <input
            {...register("password")}
            id="password"
            type="password"
            className="rounded-md border border-gray-400 px-2 py-1"
            name="password"
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
          <label htmlFor="password_confirm">Confirmar contraseña:</label>
          <input
            {...register("cpassword")}
            id="password_confirm"
            type="password"
            className="rounded-md border border-gray-400 px-2 py-1"
            name="cpassword"
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

        <div className="flex flex-col items-center justify-center space-y-1 pt-4">
          <button
            className={`w-full rounded-md bg-primary px-2 py-2 uppercase text-white duration-150 hover:bg-black/90`}
          >
            {"Registrar"}
          </button>
          <div className="flex w-full items-center justify-between space-x-2">
            <p className="h-0.5 w-full rounded-full border border-black/20"></p>
            <p className="text-[12px] uppercase text-black/40">o</p>
            <p className="h-0.5 w-full rounded-full border border-black/20"></p>
          </div>
          <Link
            href={"./sign-in"}
            className={`w-full rounded-md bg-dark px-2 py-2 text-center uppercase text-white duration-150 hover:bg-black/90`}
          >
            ingresar
          </Link>
        </div>
        {/* {errors && (
          <div className="mb-4 rounded-md bg-red-500 p-3 text-center text-white">
            {errors}
          </div>
        )}
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
