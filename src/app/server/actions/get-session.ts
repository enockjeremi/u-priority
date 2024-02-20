"use server";

import { cookies } from "next/headers";
import { USER_TOKEN_NAME } from "../constants/user-token";
import { auth } from "@/app/libs/endpoints/auth";

export const getSession = async () => {
  const token = cookies().get(USER_TOKEN_NAME)?.value;
  if(!token) return null
  const response = await fetch(auth.profile, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
};
