import React from "react";
import SettingsWorkspacesComponent from "./components/settings-workspaces-components";
import axios from "axios";
import { workspaces } from "@/app/libs/endpoints/workspaces";
import { cookies } from "next/headers";
import { USER_TOKEN_NAME } from "@/app/server/constants/user-token";

const getWorkspaces = async (id: number, token: any) => {
  const res = await axios
    .get(workspaces.getBy(id), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
  return res;
};

const Page = async ({ params }: { params: any }) => {
  const token = cookies().get(USER_TOKEN_NAME)?.value;
  const workspaces = await getWorkspaces(params.id, token)
  console.log(workspaces)
  return <SettingsWorkspacesComponent workspaces={workspaces} />;
};

export default Page;
