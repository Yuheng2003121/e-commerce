import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { de } from "date-fns/locale";

import z from "zod";

export const reviewRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.findByID({
        collection: "products",
        id: input.productId,
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not Found",
        });
      }

      const reviewData = await ctx.db.find({
        collection: "reviews",
        limit: 1,
        where: {
          and: [
            { product: { equals: product.id } },
            { user: { equals: ctx.session.user.id } },
          ],
        },
      });
      const review = reviewData.docs[0];
      if (!review) {
        return null;
      }

      return review;
    }),

  create: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        rating: z
          .number()
          .min(0, { message: "Rating must be between 0 and 5" })
          .max(5, { message: "Rating must be between 0 and 5" }),
        description: z.string().min(1, { message: "Description is required" }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.db.findByID({
        collection: "products",
        id: input.productId,
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not Found",
        });
      }

      const existingRviewsData = await ctx.db.find({
        collection: "reviews",
        where: {
          and: [
            { product: { equals: product.id } },
            { user: { equals: ctx.session.user.id } },
          ],
        },
      })

      if (existingRviewsData.docs.length > 0){
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already reviewed this product",
        });
      }

      const review = await ctx.db.create({
        collection: "reviews",
        data: {
          product: product.id,
          user: ctx.session.user.id,
          rating: input.rating,
          description: input.description,
        },
      });

      return review;
    }),

    update: protectedProcedure
    .input(
      z.object({
        reviewId: z.string(),
        rating: z
          .number()
          .min(0, { message: "Rating must be between 0 and 5" })
          .max(5, { message: "Rating must be between 0 and 5" }),
        description: z.string().min(1, { message: "Description is required" }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingReview = await ctx.db.findByID({
        depth: 0,
        collection: "reviews",
        id: input.reviewId,
      });

      if (!existingReview) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not Found",
        });
      }

      if (existingReview.user !== ctx.session.user.id){
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to update this review",
        });
      }


      const updatedReview = await ctx.db.update({
        collection: "reviews",
        id: input.reviewId,
        data: {
          rating: input.rating,
          description: input.description,
        },
      });

      return updatedReview;
    }),
});
