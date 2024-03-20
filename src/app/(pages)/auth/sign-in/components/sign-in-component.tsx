"use client";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import Joi from "joi";

import { joiResolver } from "@hookform/resolvers/joi";
import { esErrors } from "@/utils/joi-es-errors";

import useSignIn from "@/app/client/hooks/useSignIn";

import { ICredentialsToSignIn } from "@/types/auth.types";
import { Input } from "@material-tailwind/react";
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
        className="flex w-full sm:w-[500px] flex-col space-y-3 p-4 text-sm"
      >
        {/* {success && (
          <div className="mb-4 rounded-md bg-green-500 p-3 text-center text-white">
            {success}
          </div>
        )} */}
        <div className="w-full flex flex-col space-y-2">
          <Input {...register("email")} label="Email" crossOrigin={undefined} />
          {/* <input
            {...register("email")}
            id="email_label"
            type="text"
            name="email"
            className="rounded-md border border-gray-400 px-2 py-1"
          /> */}
          {errors.email && (
            <p
              role="alert"
              className="text-white px-2 py-2 rounded-md bg-red-500"
            >
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="-full flex flex-col space-y-2">
          <Input {...register("password")} type="password" label="Contraseña" crossOrigin={undefined} />

          {errors.password && (
            <p
              role="alert"
              className="text-white px-2 py-2 rounded-md bg-red-500"
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
          <button
            disabled={isLoading && true}
            className={`${
              isLoading && "cursor-not-allow hover:bg-black/30"
            } w-full rounded-md bg-primary px-2 py-2 uppercase text-white duration-150 hover:bg-black/90`}
          >
            {isLoading ? "cargando.. " : "ingresar"}
          </button>

          <p className="py-2 text-[12px] text-slate-500">
            <span>¿No tienes una cuenta? </span>
            <Link
              href={"./sign-up"}
              className={`hover:text-dark ${
                isLoading ? "pointer-events-none" : ""
              } hover:underline underline-offset-4`}
            >
              registrate
            </Link>
          </p>
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
