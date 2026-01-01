import { cookies as getCookies } from "next/headers";

interface Props {
  prefix: string;
  value: string;
}

export const generateAuthCookie = async ({ prefix, value }: Props) => {
  const isProd = process.env.NODE_ENV === "production";
  const cookies = await getCookies();
  cookies.set({
    name: `${prefix}-token`,
    value: value,
    httpOnly: true,
    path: "/", 
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    domain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
  });
};
