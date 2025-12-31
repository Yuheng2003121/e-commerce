import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { headers as getHeaders} from "next/headers";

import z from "zod";
import { TRPCError } from "@trpc/server";
import { generateAuthCookie } from "../utils";
import { stripe } from "@/lib/stripe";

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();

    const session = await ctx.db.auth({ headers });

    return session;
  }),

  register: baseProcedure
    .input(
      z.object({
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
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.find({
        collection: "users",
        limit: 1,
        where: {
          username: {
            equals: input.username,
          },
        },
      });

      
      if (existingUser.totalDocs > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username already exists",
        });
      }

      const account = await stripe.accounts.create({});

      if (!account) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error creating stripe account",
        });
      }

      const  tenant = await ctx.db.create({
        collection: "tenants",
        data: {
          name: input.username,
          slug: input.username,
          stripeAccountId: account.id,
        }
      })
      

      await ctx.db.create({
        collection: "users",
        data: {
          email: input.email,
          password: input.password, //will automatically hashed by payload
          username: input.username,
          tenants: [
            {
              tenant: tenant.id,
            },
          ],
        },
      });
  

      //login after register
      const data = await ctx.db.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
        },
      });

      if (!data.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

       await generateAuthCookie({
         prefix: ctx.db.config.cookiePrefix,
         value: data.token,
       });


      return data;
    }),

  login: baseProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
        },
      });

      if (!data.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      await generateAuthCookie({
        prefix: ctx.db.config.cookiePrefix,
        value: data.token,
      });

      return data;
    }),

});
