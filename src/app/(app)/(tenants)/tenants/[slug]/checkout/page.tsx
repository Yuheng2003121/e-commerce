import CheckoutView from "@/modules/checkout/ui/views/CheckoutView";
import React from "react";

interface PageProps {
  params: Promise<{slug: string}>
}
export default async function Page({params}: PageProps) {
  const {slug} = await params;

  return <CheckoutView tenantSlug={slug} />;
}
