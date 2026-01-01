"use client"

import { InboxIcon, TriangleAlertIcon } from "lucide-react";

export default function ErrorPage() {
  return (
    <div className="px-4 lg:px-12 py-10">
      <div className="p-8  border border-black border-dash flex flex-col items-center justify-center gap-4 bg-white rounded-lg ">
      <TriangleAlertIcon />
      <p className="text-base font-medium">Something went wrong</p>
    </div>
    </div>
  );
}