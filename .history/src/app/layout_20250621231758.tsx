import type { Metadata } from "next";
import { Geist_Mono, Quicksand } from "next/font/google";
import "./globals.css";
import { NextFont } from "next/dist/compiled/@next/font";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
// import { AuthStatus } from "@/components/AuthStatus";
import { ToastProvider } from "@/contexts/ToastContext";
import { CartProvider } from "@/contexts/CartContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { GlobalLoadingOverlay } from "@/components/ui/GlobalLoadingOverlay";
import { Toaster } from "react-hot-toast";
import "@/utils/cleanLocalStorage";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
