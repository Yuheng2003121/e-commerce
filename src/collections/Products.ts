import { isSuperAdmin } from "@/lib/access";
import { Tenant } from "@/payload-types";
import { lexicalEditor, UploadFeature } from "@payloadcms/richtext-lexical";
import type { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
    description:
      "You must verify your Stripe account before you can create products.",
  },

  access: {
    create: ({ req }) => {
      if (isSuperAdmin(req.user)) return true;
      const tenant = req.user?.tenants?.[0]?.tenant as Tenant;
      return Boolean(tenant?.stripeDetailsSubmitted);
    },
    delete: ({ req }) => isSuperAdmin(req.user),
  },

  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "richText",
    },
    {
      name: "price",
      type: "number",
      required: true,
      admin: {
        description: "In USD",
      },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      hasMany: false,
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
    },

    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "refundPolicy",
      type: "select",
      options: ["1 day", "7 days", "14 days", "30 days", "no-refund"],
      defaultValue: "7 days",
    },
    {
      name: "content",
      type: "richText",
      editor: lexicalEditor({
        features:({defaultFeatures}) => [
          ...defaultFeatures,
          UploadFeature({
            collections:{
              media: {
                fields: [
                  {
                    name: "alt",
                    type: "text"
                  }
                ]
              }
            }
          })
        ]
      }),
      admin: {
        description:
          "Protected content only visible to customers after purcahse. Supports Markdown",
      },
    },
    {
      name: "isPrivate",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description:
          "If checked, this product will not be shown on the public storefront",
      },
    },

    {
      name: "isArchived",
      label: "Archived",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description:
          "If checked, this product will not be visible to customers.",
      },
    },
  ],
};
