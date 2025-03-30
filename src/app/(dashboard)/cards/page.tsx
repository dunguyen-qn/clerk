import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

type Card = {
  id: string;
  title: string;
  createdAt: string;
};

export default async function CardsPage() {
  const supabase = await createClient();

  const { data: cards } = await supabase.from("cards").select<"*", Card>("*");
  console.log("cards :>> ", cards);

  return (
    <ul>
      {cards?.map((card) => (
        <li key={card.id}>{card.title}</li>
      ))}
    </ul>
  );
}
