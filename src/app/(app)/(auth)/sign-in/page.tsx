import SignInView from "@/modules/auth/ui/views/SignInView";
import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function SignIn() {
  const session = await caller.auth.session();
  if (session.user) {
    redirect("/");
  }
  return (
    <div>
      <SignInView />
    </div>
  );
}
