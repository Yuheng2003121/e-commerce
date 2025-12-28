import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

export function Footer() {
  return (
    <footer className="border-t font-medium bg-white">
      <div className="container mx-auto flex items-center gap-2 py-6 lg:px-12">
        <p className="">Powered by </p>
        <Link href={"/"}>
          <span className={cn("text-2xl font-semibold", poppins.className)}>
            Funroad
          </span>
        </Link>
      </div>
    </footer>
  );
}
