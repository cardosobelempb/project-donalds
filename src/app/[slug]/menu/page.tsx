import { notFound } from "next/navigation";

import { RestaurantHeader } from "@/components/shared/restautant-header";
import { db } from "@/lib/prisma";

interface RestaurantMenuPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ option: string }>;
}

const isOptionValid = (oprion: string) => {
  return ["DINE_IN", "TAKEAWAY"].includes(oprion.toUpperCase());
};

const RestaurantMenuPage = async ({
  params,
  searchParams,
}: RestaurantMenuPageProps) => {
  const { slug } = await params;
  const { option } = await searchParams;

  if (!isOptionValid(option)) {
    return notFound();
  }

  const restaurant = await db.restaurant.findUnique({ where: { slug } });

  if (!restaurant) {
    return notFound();
  }
  return (
    <div>
      <RestaurantHeader restaurant={restaurant} />
    </div>
  );
};

export default RestaurantMenuPage;
