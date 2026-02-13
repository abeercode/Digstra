import { auth } from "@/auth";
import LogoutButton from "@/components/LogoutButton";

export default async function Dashboard() {
    const session = await auth();
    const userPoints = session?.user?.points ?? 0;
    if (!session) {
  return <p>Redirecting...</p>; // Or just return null
}
    return <>
        <h1>hi welcome back,{session?.user?.name}  </h1>
        <h1>you have {session?.user?.points} number of points </h1>
        <LogoutButton/ >

    </>

}