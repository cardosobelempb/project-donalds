import { ConsumptionMethod } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface ConsumptionMethodOptionProps {
  imageUrl: string;
  imageAlt: string;
  buttonText: string;
  option: ConsumptionMethod;
  slug: string;
}

export const ConsumptionMethodOption = ({
  imageUrl,
  imageAlt,
  buttonText,
  option,
  slug,
}: ConsumptionMethodOptionProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-8 py-8">
        <div className="relative h-[80px] w-[80px]">
          <Image
            className="object-contain"
            src={imageUrl}
            alt={imageAlt}
            fill
            priority
          />
        </div>
        <Button asChild variant={"secondary"} className="rounded-full">
          <Link href={`/${slug}/menu?option=${option.toLocaleLowerCase()}`}>
            {buttonText}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
