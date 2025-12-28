"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  Eye,
  EyeOff,
  Mail,
  ShieldCheck,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(63, "Username must be less than 63 characters long")
    .regex(
      /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/,
      "Username can only contain letters and numbers"
    )
    .refine(
      (val) => !val.includes("--"),
      "Username cannot contain consecutive dashes"
    )
    .transform((val) => val.toLowerCase()),
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});
export default function SignUpView() {
  const form = useForm<z.infer<typeof formSchema>>({
    // mode: "all",
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const router = useRouter();
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const register = useMutation(
    trpc.auth.register.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.auth.session.queryFilter());
        toast.success("Successfully registered");
        form.reset();
        router.push("/");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Add explicit validation
    if (!values.email || !values.password || !values.username) {
      console.error("Missing form data");
      return;
    }
    register.mutate(values);
  };

  const username = form.watch("username");
  const usernameErrors = form.formState.errors.username;
  const showPreview = username && !usernameErrors;

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 bg-[#F4F4F0]">
      {/* left */}
      <div className="h-screen hidden lg:col-span-2 lg:block bg-[#EBEBE6]">
        <div className="hidden h-full lg:flex flex-col  justify-between p-12">
          <div className="flex items-center gap-2 mb-20">
            <ShoppingBag size={24} strokeWidth={1.5} />
            <h1
              className={cn(
                "text-xl font-bold tracking-[0.2em] uppercase",
                poppins.className
              )}
            >
              Funroad
            </h1>
          </div>

          <h1 className="mx-auto text-6xl font-serif italic leading-tight mb-8">
            Curated for your <br />
            modern lifestyle.
          </h1>
          <p className="mx-auto  text-lg text-slate-600 max-w-md font-light leading-relaxed">
            Join our exclusive community to access early drops, member-only
            pricing, and personalized styling.
          </p>

          {/* Benefits Footer */}
          <div className="mt-auto">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
              <Truck size={14} /> Free Shipping
            </div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
              <ShieldCheck size={14} /> Secure Payment
            </div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
              <CreditCard size={14} /> Member Perks
            </div>
          </div>
        </div>
      </div>

      {/* right */}
      <div className="h-screen w-full lg:col-span-3 p-18">
        <Form {...form}>
          <div className="h-full flex flex-col">
            <div className="mb-12">
              <h2 className="text-3xl font-serif mb-3 italic">
                Create Account
              </h2>
              <p className="text-slate-500 font-light text-sm">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="text-[#1A1A1A] font-semibold border-b border-black/20 hover:border-black transition-all"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-14">
              <FormField
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="group relative">
                        <input
                          // {...form.register("username")}
                          {...field}
                          placeholder="John Doe"
                          className="w-full py-3 bg-transparent border-b border-slate-200 focus:border-black outline-none transition-all placeholder:text-slate-300 font-light"
                        />
                        <User
                          className="absolute right-0 top-3 text-slate-300 group-focus-within:text-black transition-colors"
                          size={16}
                        />
                      </div>
                    </FormControl>
                    <FormDescription
                      className={cn("hidden", showPreview && "block")}
                    >
                      Your store will be available at{" "}
                      <strong>{username}.funroad.com</strong>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <div className="group relative">
                        <input
                          // {...form.register("username")}
                          {...field}
                          placeholder="example@gmail.com"
                          className="w-full py-3 bg-transparent border-b border-slate-200 focus:border-black outline-none transition-all placeholder:text-slate-300 font-light"
                        />
                        <Mail
                          className="absolute right-0 top-3 text-slate-300 group-focus-within:text-black transition-colors"
                          size={16}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="group relative">
                        <input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="w-full py-3 bg-transparent border-b border-slate-200 focus:border-black outline-none transition-all placeholder:text-slate-300 font-light"
                        />
                        {!showPassword ? (
                          <Eye
                            className="cursor-pointer absolute right-0 top-3 text-slate-300 group-focus-within:text-black transition-colors"
                            size={16}
                            onClick={() => setShowPassword(true)}
                          />
                        ) : (
                          <EyeOff
                            className="cursor-pointer absolute right-0 top-3 text-slate-300 group-focus-within:text-black transition-colors"
                            size={16}
                            onClick={() => setShowPassword(false)}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Marketing Consent */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="mt-1 accent-black"
                  id="marketing"
                />
                <label
                  htmlFor="marketing"
                  className="text-xs text-slate-500 leading-tight cursor-pointer"
                >
                  Sign up to receive news about latest collections, events and
                  concierge services.
                </label>
              </div>

              <Button
                disabled={register.isPending}
                type="submit"
                variant={"elevated"}
                className=" w-full bg-black text-white hover:bg-pink-400 hover:text-primary"
              >
                Create Account
              </Button>
            </form>

            <footer className="mt-auto text-[10px] text-slate-400 leading-relaxed text-center">
              By creating an account, you agree to our <br />
              <a href="#" className="underline">
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a href="#" className="underline">
                Privacy Policy
              </a>
              .
            </footer>
          </div>
        </Form>
      </div>
    </div>
  );
}
