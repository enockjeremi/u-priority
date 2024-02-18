"use client";
import { esErrors } from "@/utils/joi-es-errors";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import Link from "next/link";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type CredentialsToSignIn = {
  email: string;
  password: string;
};


const schema = Joi.object({
  email: Joi.string()
    .required()
    .messages(esErrors)
    .email({ tlds: { allow: false } }),
  password: Joi.string().required().min(7).messages(esErrors),
});

const SignInComponent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CredentialsToSignIn>({ resolver: joiResolver(schema) });

  const isLoading = false;
  const onSubmit: SubmitHandler<CredentialsToSignIn> = (data) => {};

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full sm:w-[500px] flex-col space-y-3 p-4 text-sm"
      >
        {/* {successMessage && (
        <div className="mb-4 rounded-md bg-green-500 p-3 text-center text-white">
          {successMessage}
        </div>
      )} */}
        <div className="w-full flex flex-col space-y-2">
          <label htmlFor="email_label">Email</label>
          <input
            {...register("email")}
            id="email_label"
            type="text"
            name="email"
            className="rounded-md border border-gray-400 px-2 py-1"
          />
          {errors.email && <p role="alert" className="text-white px-2 py-2 rounded-md bg-red-500">{errors.email.message}</p>}
        </div>
        <div className="-full flex flex-col space-y-2">
          <label htmlFor="password_label">Contraseña:</label>
          <input
            {...register("password")}
            id="password_label"
            type="password"
            className="rounded-md border border-gray-400 px-2 py-1"
            name="password"
          />
          {errors.password && <p role="alert" className="text-white px-2 py-2 rounded-md bg-red-500">{errors.password.message}</p>}
        </div>
        <div className="flex flex-col items-center justify-center space-y-1 pt-4">
          <button
            disabled={isLoading && true}
            className={`${
              isLoading && "cursor-not-allow hover:bg-black/30"
            } w-full rounded-md bg-primary px-2 py-2 uppercase text-white duration-150 hover:bg-black/90`}
          >
            {isLoading ? "cargando.. " : "ingresar"}
          </button>
          <div className="flex w-full items-center justify-between space-x-2">
            <p className="h-0.5 w-full rounded-full border border-black/20"></p>
            <p className="text-[12px] uppercase text-black/40">o</p>
            <p className="h-0.5 w-full rounded-full border border-black/20"></p>
          </div>
          <Link
            href={"./sign-up"}
            className={`w-full rounded-md bg-dark px-2 py-2 text-center uppercase text-white duration-150 hover:bg-black/90`}
          >
            Registrar
          </Link>
        </div>

        {/*}
      {message && (
        <div className="rounded-md bg-red-500 p-3 text-center text-white">
          {message}
        </div>
      )} */}
      </form>
    </>
  );
};

export default SignInComponent;
