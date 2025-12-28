// import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant';
import type { CollectionConfig } from 'payload'
import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields";


const defaultTenantArrayField = tenantsArrayField({
  tenantsArrayFieldName: "tenants",
  tenantsArrayTenantFieldName: "tenant",
  tenantsCollectionSlug: "tenants",
  arrayFieldAccess: {
    read: () => true,
    update: () => true,
    create: () => true,
  },
  tenantFieldAccess: {
    read: () => true,
    update: () => true,
    create: () => true,
  },
});

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  fields: [
    {
      name: "username",
      type: "text",
      required: true,
      unique: true,
    },
    {
      admin: {
        position: "sidebar",
      },
      name: "roles",
      type: "select",
      defaultValue: ["user"],
      hasMany: true,
      options: ["super-admin", "user"],
    },
    {
      ...defaultTenantArrayField,
      admin: {
        ...(defaultTenantArrayField?.admin || {}),
        position: "sidebar",
      },
    },
  ],
};
