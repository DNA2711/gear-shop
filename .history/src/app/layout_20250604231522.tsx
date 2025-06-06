import type { Metadata } from "next";
import { Geist_Mono, Quicksand } from "next/font/google";
import "./globals.css";
import { NextFont } from "next/dist/compiled/@next/font";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const fontSans: NextFont = Quicksand({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Gear Shop",
  description:
    "Gear Shop is a Next.js e-commerce application built with TypeScript, Tailwind CSS, and Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vn">
      <body
        className={fontSans.className}
        suppressContentEditableWarning={true}
      >
        {children}
        <div className="min-h-screen flex flex-col justify-between">
          <Header />
          <main className="mt-24">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
