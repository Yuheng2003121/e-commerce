"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  Eye,
  Mail,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});
export default function SignInView() {
  const form = useForm<z.infer<typeof formSchema>>({
    // mode: "all",
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const login = useMutation(trpc.auth.login.mutationOptions({
    onSuccess: async () => { 
      await queryClient.invalidateQueries(trpc.auth.session.queryFilter());
      toast.success("Successfully registered");
      form.reset();
      router.push("/");
    },
    onError: (error) => { 
      toast.error(error.message);
    },
  }));
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Add explicit validation
    if (!values.email || !values.password) {
      console.error("Missing form data");
      return;
    }
    login.mutate(values);
  };



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
                Welcome Back
              </h2>
              
            </div>

            {/* form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-14">
       

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
                          type="password"
                          placeholder="••••••••"
                          className="w-full py-3 bg-transparent border-b border-slate-200 focus:border-black outline-none transition-all placeholder:text-slate-300 font-light"
                        />
                        <Eye
                          className="absolute right-0 top-3 text-slate-300 group-focus-within:text-black transition-colors"
                          size={16}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <Button
                disabled={login.isPending}
                type="submit"
                variant={"elevated"}
                className=" w-full bg-black text-white hover:bg-pink-400 hover:text-primary"
              >
                Log in
              </Button>
            </form>

          </div>
        </Form>
      </div>
    </div>
  );
}
