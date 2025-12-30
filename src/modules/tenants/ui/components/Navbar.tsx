"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { generateTenantUrl } from "@/lib/utils";
// import CheckoutButton from "@/modules/checkout/ui/components/CheckoutButton";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ShoppingCartIcon } from "lucide-react";

const CheckoutButton = dynamic(
  () => import("@/modules/checkout/ui/components/CheckoutButton"),
  {
    ssr: false,
    loading: () => (
      <Button variant={"elevated"} className="bg-white">
        <ShoppingCartIcon /> 
        <span className="opacity-0">0</span>
      </Button>
    ),
  }
);

interface NavbarProps {
  slug: string;
}
export function Navbar({ slug }: NavbarProps) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.tenants.getOne.queryOptions({ slug }));

  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div className="container mx-auto flex items-center justify-between h-full lg:px-12">
        <Link
          href={generateTenantUrl(slug)}
          className="flex gap-2 items-center "
        >
          {data.image?.url && (
            <Image
              src={data.image.url}
              alt="slug"
              width={32}
              height={32}
              className="rounded-full border shrink-0 size-8"
            />
          )}
          <p className="text-xl">{data.name}</p>
        </Link>
        <CheckoutButton hideIfEmpty tenantSlug={slug} />
      </div>
    </nav>
  );
}

export function NavbarSkeleton() {
  return (
    <nav className="h-20 border-b font-medium bg-white">
      <Skeleton className="container mx-auto flex items-center justify-between h-8 lg:px-12"></Skeleton>
    </nav>
  );
}
