import { auth, currentUser } from "@clerk/nextjs/server";
import { URLSearchParams } from "url";

type Props = {
  searchParams: Promise<{
    startEnd: string;
    endDate: string;
    page: string;
    pageSize: string;
    query: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  // Get the userId from auth() -- if null, the user is not signed in
  const { userId } = await auth();

  // Protect the route by checking if the user is signed in
  if (!userId) {
    return <div>Sign in to view this page</div>;
  }

  // Get the Backend API User object when you need access to the user's information
  const user = await currentUser();

  const params = new URLSearchParams(await searchParams);

  try {
    const response = await fetch(
      `http://localhost:3000/api/products?${params.toString()}`
    );
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
    </div>
  );
}
