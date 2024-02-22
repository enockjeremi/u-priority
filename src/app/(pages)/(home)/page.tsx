import { getSession } from "@/app/server/actions/get-session";
import HomeComponent from "./components/home-component";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();
  if (!session) redirect("/auth/sign-in");

  return <HomeComponent session={session} />;
}
