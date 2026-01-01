import { NextRequest, NextResponse } from "next/server";

export const config = {
  // 匹配所有路径，排除：
  // - API 路由、Next.js 内部、静态资源、租户路径、根目录文件
  matcher: ["/((?!api|_next|_static|_vercel|media|tenants|[\\w-]+\\.\\w+).*)"],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "";

  if (hostname.endsWith(`.${rootDomain}`)) {
    const tenantSlug = hostname.replace(`.${rootDomain}`, "");

    //服务器返回 /tenants/[slug]/[...slug] 的内容，但地址栏仍是 [slug].myapp.com/products/123
    return NextResponse.rewrite(
      new URL(`/tenants/${tenantSlug}${url.pathname}`, req.nextUrl)
    );
  }

  return NextResponse.next();
}