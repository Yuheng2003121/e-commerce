"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { Fragment, useState } from "react";
import { formatAsCurrency } from "../components/PriceFilter";
import Link from "next/link";
import { generateTenantUrl } from "@/lib/utils";
import StarRating from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { CopyCheckIcon, LinkIcon, StarIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import dynamic from "next/dynamic";
import Message from "@/components/Message";

const CartButton = dynamic(() => import("../components/CartButton"), {
  ssr: false,
  loading: () => (
    <Button disabled variant={"elevated"} className="flex-1 bg-pink-400">
      Loading...
    </Button>
  ),
});

interface ProductViewProps {
  productId: string;
  tenantSlug: string;
}
export default function ProductView({
  productId,
  tenantSlug,
}: ProductViewProps) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({
      id: productId,
    })
  );
  const [isCopied, setIsCopied] = useState(false);

  return (
    <div className="px-4 lg:px-12 py-10">
      <div className="border rounded-sm bg-white overflow-hidden">
        <div className="relative aspect-[3.9] border-b">
          <Image
            src={data.image?.url || "/place-holder.png"}
            alt={data.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6">
          <div className="col-span-4">
            <div className="p-6">
              <h1 className="text-4xl font-medium">{data.name}</h1>
            </div>
            <div className="border-y flex">
              <div className="p-4 border-r">
                <div className="w-fit px-2 py-1 bg-pink-400 border-black border rounded-md">
                  {formatAsCurrency(data.price)}
                </div>
              </div>

              <div className="px-6 py-4 lg:border-r">
                <Link
                  href={`${generateTenantUrl(tenantSlug)}`}
                  className="flex items-center gap-2"
                >
                  {data.tenant?.image?.url && (
                    <Image
                      src={data.tenant.image.url}
                      alt={data.tenant?.name}
                      width={40}
                      height={40}
                      className="rounded-full border shrink-0 size-10"
                    />
                  )}
                  <p className="text-base hover:underline font-medium">
                    {data.tenant.name}
                  </p>
                </Link>
              </div>

              <div className="hidden lg:flex px-6 py-4 items-center justify-center">
                <div className="flex items-center gap-2">
                  <StarRating
                    rating={data.reviewRating}
                    iconClassName="size-4"
                  />
                  <p className="text-base font-medium">
                    {data.reviewCount} ratings
                  </p>
                </div>
              </div>
            </div>
            <div className="block lg:hidden px-6 py-4 items-center justify-center border-b">
              <div className="flex items-center gap-2">
                <StarRating rating={data.reviewRating} iconClassName="size-4" />
                <p className="text-base font-medium">
                  {data.reviewCount} ratings
                </p>
              </div>
            </div>

            <div className="p-6">
              {data.description ? (
                <p>{data.description}</p>
              ) : (
                <p className="font-medium text-muted-foreground italic">
                  No descrition provided
                </p>
              )}
            </div>
          </div>

          <div className="col-span-2">
            <div className="border-t lg:border-t-0 lg:border-l h-full">
              <div className="flex flex-col gap-4 p-5 border-b">
                <div className="flex gap-2 items-center">
                  <CartButton
                    tenantSlug={tenantSlug}
                    productId={productId}
                    isPurchased={data.isPurchased}
                  />
                  <Message
                    className="size-12"
                    text={isCopied ? "Copied" : "Copy link"}
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 5000);
                    }}
                  >
                    {!isCopied ? <LinkIcon /> : <CopyCheckIcon />}
                  </Message>
                </div>
                <p className="font-medium text-center">
                  {data.refundPolicy === "no-refund"
                    ? "No refunds"
                    : `${data.refundPolicy} money back guaranteed`}
                </p>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium">Ratings</h3>
                  <div className="flex items-center gap-1 font-medium">
                    <StarIcon className="size-4 fill-black" />
                    <p>({data.reviewRating})</p>
                    <p className="text-base">{data.reviewCount} ratings</p>
                  </div>
                </div>
                <div className="grid grid-cols-[auto_1fr_auto] gap-3 mt-3">
                  {[5, 4, 3, 2, 1, 0].map((star) => (
                    <Fragment key={star}>
                      <div className="font-medium">
                        {star} {star === 1 ? "star" : "stars"}
                      </div>
                      <Progress
                        value={data.ratingDistribution[star]}
                        className="h-lh"
                      />
                      <div className="font-medium">
                        {data.ratingDistribution[star]}%
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
