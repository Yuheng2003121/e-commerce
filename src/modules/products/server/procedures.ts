import { Category, Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Sort, Where } from "payload";
import z from "zod";
import { sortValues } from "../searchParams";
import { DEFAULT_LIMIT } from "@/modules/tags/constants";
import { headers as getHeaders } from "next/headers";

export const productsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const headers = await getHeaders();
      const session = await ctx.db.auth({ headers });


      const product = await ctx.db.findByID({
        id: input.id,
        collection: "products",
        depth: 2,
      });

      let isPurchased = false;
      if (session.user) {
        const order = await ctx.db.find({
          collection: "orders",
          pagination:false,
          limit: 1,
          where: {
            and: [
              {products: {equals: input.id}},
              {user: {equals: session.user.id}}
            ]
          }
        })

        isPurchased = order.docs.length > 0;
      }

      return {
        ...product,
        isPurchased,
        image: product.image as Media | null,
        tenant: product.tenant as Tenant & {image: Media | null}
      }
    }),
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.string().array().nullable().optional(),
        sort: z.enum(sortValues).nullable().optional(),
        tenantSlug: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};
      let sort: Sort = "-createdAt" 
      if (input.sort) {
        if (input.sort === "hot_and_new") {
          sort = "-createdAt";
        }
      } 

      if (input.minPrice) {
        where.price = {
          greater_than_equal: parseInt(input.minPrice),
        };
      }

      if (input.maxPrice) {
        where.price = {
          ...where.price,
          less_than_equal: parseInt(input.maxPrice),
        };
      }

      if (input.tenantSlug){
        where["tenant.slug"] = {
          equals: input.tenantSlug
        }
      }

      

      if (input.category) {
        if (
          input.category &&
          (input.category === "favicon.ico" ||
            input.category === "robots.txt" ||
            input.category === "undefined" || // ← 关键！防字符串 "undefined"
            input.category.startsWith(".") ||
            input.category.length === 0)
        ) {
          // 静默返回空，不查 DB
          return {
            docs: [],
            totalDocs: 0,
            limit: 0,
            page: 1,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          };
        }

        const categoriesData = await ctx.db.find({
          collection: "categories",
          limit: 1,
          pagination: false,
          where: {
            slug: {
              equals: input.category,
            },
          },
        });

        const formattedData = categoriesData.docs.map((doc) => ({
          ...doc,
          subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
            ...(doc as Category),
            subcategories: undefined,
          })),
        }));
        const category = formattedData[0];
        if (!category) {
          return {
            docs: [],
            totalDocs: 0,
            limit: input.limit,
            page: input.cursor,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          };
        }
        

        if (!!category.subcategories.length) {

          //case with subcategories
          where["category.slug"] = {
            in:[category.slug, ...category.subcategories.map((subcategory) => subcategory.slug)]
          }

        } else {
          //case without subcategories
          where["category.slug"] = {
            equals: category.slug
          };
        }
      } 

      if (input.tags && !!input.tags.length) {
        where["tags.name"] = {
          in: input.tags,
        };
      } 


      const products = await ctx.db.find({
        collection: "products",
        depth: 2,
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
      });

      return {
        ...products,
        docs:products.docs.map(doc => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & {image: Media | null}
        }))
      };
    }),
});
