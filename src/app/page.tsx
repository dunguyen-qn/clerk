import CardInfo from "@/components/card";
import CustomModal from "@/components/modal";
import Table from "@/components/table";
import { auth, currentUser } from "@clerk/nextjs/server";
import { headers } from "next/headers";

export default async function Page() {
  // Get the userId from auth() -- if null, the user is not signed in
  const { userId } = await auth();
  const header = await headers();

  console.log(header);

  // Protect the route by checking if the user is signed in
  if (!userId) {
    return <div>Sign in to view this page</div>;
  }

  // Get the Backend API User object when you need access to the user's information
  const user = await currentUser();
  try {
    const response = await fetch(`http://localhost:3000/api/products`);
    const data = await response.json();

    console.log(data);
  } catch (error) {
    console.log(error);
  }

  // Use `user` to render user details or create UI elements
  return (
    <div>
      <h1 className="text-3xl font-bold underline text-red-300">
        Welcome, {user?.firstName}!
      </h1>
      <Table />
      <CardInfo />
      <CustomModal />
    </div>
  );
}
