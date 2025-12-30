import { Navbar } from "@/modules/checkout/ui/components/Navbar";
import { Footer } from "@/modules/tenants/ui/components/Footer";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}
export default async function Layout({ children, params }: LayoutProps) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col ">
      <Navbar slug={slug} />
      <div className="flex-1 container mx-auto">{children}</div>
      <Footer />
    </div>
  );
}
