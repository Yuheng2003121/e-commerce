import React, { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SearchFilter from "./search-filters";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { Category } from "@/payload-types";
import { subMinutes } from "date-fns";

export default async function Layout({ children }: { children: ReactNode }) {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories",
    depth: 1,
    pagination: false,
    where: {
      parent: {
        exists: false,
      },
    },
  });

  const formattedData  = data.docs.map(doc => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map(doc => ({
      ...(doc as Category),
      subcategories: undefined
    }))
  }))

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchFilter data={formattedData} />
      <div className="flex-1 bg-[#F4F4F0]">{children}</div>
      <Footer />
    </div>
  );
}
