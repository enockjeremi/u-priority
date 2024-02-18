"use client";
import Link from "next/link";
import React, { FormEvent } from "react";

const SignUpComponent = () => {
  const isLoading = false;
  const handleChange = () => {};
  const handleSubmit = (event: FormEvent) => {
    event?.preventDefault();
  };
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex w-full sm:w-[500px] flex-col space-y-3 p-4 text-sm"
      >
        <div className="flex flex-col space-y-2">
          <label htmlFor="username_label">Nombre de usuario:</label>
          <input
            type="text"
            id="username_label"
            name="username"
            onChange={handleChange}
            className="rounded-md border border-gray-400 px-2 py-1"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="email_label">Email:</label>
          <input
            id="email_label"
            type="email"
            name="email"
            onChange={handleChange}
            className="rounded-md border border-gray-400 px-2 py-1"
          />
        </div>
        <div className="py-1"></div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="password">Contraseña:</label>
          <input
            id="password"
            type="password"
            className="rounded-md border border-gray-400 px-2 py-1"
            name="password"
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="password_confirm">Confirmar contraseña:</label>
          <input
            id="password_confirm"
            type="password"
            className="rounded-md border border-gray-400 px-2 py-1"
            name="cpassword"
            onChange={handleChange}
          />
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
