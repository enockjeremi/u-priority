import { getSession } from "@/app/server/actions/get-session";
import HomeComponent from "./components/home-component";
import { redirect } from "next/navigation";
import axios from "axios";
import { status } from "@/app/libs/endpoints/status";
import { priority } from "@/app/libs/endpoints/priority";
import { cookies } from "next/headers";
import { USER_TOKEN_NAME } from "@/app/server/constants/user-token";


export default async function Home() {
  const token = cookies().get(USER_TOKEN_NAME)?.value;

  const session = await getSession();
  if (!session) redirect("/auth/sign-in");

  return <HomeComponent />;
}
