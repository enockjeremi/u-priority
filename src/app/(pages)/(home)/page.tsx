import { getSession } from "@/app/server/actions/get-session";
import HomeComponent from "./components/home-component";
import { redirect } from "next/navigation";
import axios from "axios";
import { status } from "@/app/libs/endpoints/status";
import { priority } from "@/app/libs/endpoints/priority";
import { cookies } from "next/headers";
import { USER_TOKEN_NAME } from "@/app/server/constants/user-token";

const getAllStatus = async (token: any) => {
  const res = await axios
    .get(status.getAll, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
  return res;
};

const getAllPriority = async (token: any) => {
  const res = await axios
    .get(priority.getAll, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
  return res;
};

export default async function Home() {
  const token = cookies().get(USER_TOKEN_NAME)?.value;

  const statusList = await getAllStatus(token);
  const priorityList = await getAllPriority(token);

  const session = await getSession();
  if (!session) redirect("/auth/sign-in");

  return <HomeComponent statusList={statusList} priorityList={priorityList} />;
}
