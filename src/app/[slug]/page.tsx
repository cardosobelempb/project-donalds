import Image from "next/image";
import { notFound } from "next/navigation";

import { ConsumptionMethodOption } from "@/components/shared/cosumption-method-option";

import { getRestaurantBySlug } from "../data/get-restaurant-by-slug";

interface RestaurantPageProps {
  params: Promise<{ slug: string }>;
}

const RestaurantPage = async ({ params }: RestaurantPageProps) => {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);

  if (!restaurant) {
    return notFound();
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center px-6 pt-24">
      <div className="flex flex-col items-center gap-2">
        <Image
          src={restaurant?.avatarImageUrl}
          alt={restaurant?.name}
          width={82}
          height={82}
        />
        <h2 className="font-semibold">{restaurant.name}</h2>
      </div>
      <div className="space-y-2 pt-24 text-center">
        <h3 className="text-2xl font-semibold">Sejá bem vindo!</h3>
        <p className="opacity-55">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus nobis
          placeat laborum nisi ea veritatis nulla ipsa? Eum ipsam nisi minus.
          Veritatis accusantium nam maxime eaque nisi id laboriosam fugiat.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-x-4 pt-14">
        <ConsumptionMethodOption
          imageUrl="/dine_in.png"
          imageAlt="Para comer aqui"
          buttonText="Para comer aqui"
          option="DINE_IN"
          slug={restaurant.slug}
        />

        <ConsumptionMethodOption
          imageUrl="/takeaway.png"
          imageAlt="Para levar"
          buttonText="Para levar"
          option="TAKEAWAY"
          slug={restaurant.slug}
        />
      </div>
    </div>
  );
};

export default RestaurantPage;
