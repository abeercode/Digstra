import { auth } from "@/auth";
import LogoutButton from "@/components/LogoutButton";

export default async function Dashboard() {
    const session = await auth();
    if (!session) {
  return <p>Redirecting...</p>; // Or just return null
}
    return <>
        <h1>hi welcome back,{session?.user?.name}  </h1>
        <LogoutButton/ >

    </>

}