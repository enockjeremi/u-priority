import { workspaces } from "@/app/libs/endpoints/workspaces";
import { USER_TOKEN_NAME } from "@/app/server/constants/user-token";
import { getUserToken } from "@/app/server/token/user-token";
import { cookies } from "next/headers";

import React from "react";
const getWorkspaces = async (id: number, token: any) => {
  const res = await fetch(workspaces.getBy(id), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
  return res;
};

const Page = async ({ params }: { params: any }) => {
  const token = cookies().get(USER_TOKEN_NAME);
  const workspaces = await getWorkspaces(params.id, token?.value);
  return <div>{workspaces.name}</div>;
};

export default Page;
