import { workspaces } from "@/app/libs/endpoints/workspaces";
import { USER_TOKEN_NAME } from "@/app/server/constants/user-token";
import { cookies } from "next/headers";

import React from "react";
import WorkspacesComponent from "./components/workspaces-component";
import axios from "axios";
import NotFound from "@/app/not-found";
import Error from "./error";

const getWorkspaces = async (id: number, token: any) => {
  try {
    const res = await axios
      .get(workspaces.getBy(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data);
    return res;
  } catch (error) {
    console.log(error);
  }
};

const Page = async ({ params }: { params: any }) => {
  const token = cookies().get(USER_TOKEN_NAME)?.value;
  const workspaces = await getWorkspaces(params.id, token);
  if (!workspaces) return <Error />;
  return <WorkspacesComponent workspaces={workspaces} />;
};

export default Page;
