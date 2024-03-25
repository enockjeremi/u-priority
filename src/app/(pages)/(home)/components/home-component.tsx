"use client";
import { useSignOut } from "@/app/client/hooks/useSignOut";
import React from "react";

type IUserSession = {
  email: string;
  username: string;
  role: string;
};

const HomeComponent = ({ session }: { session: IUserSession }) => {
  const onSignOut = useSignOut();

  return (
    <>
      <div className="">
        <h1>{session.username}</h1>
        <button onClick={onSignOut}>Cerrar sesion</button>
        <div>Home</div>
      </div>
    </>
  );
};

export default HomeComponent;
