import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { NavigationLoadingProvider } from "@/components/providers/NavigationLoadingProvider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="pt-24">{children}</main>
      <Footer />
    </div>
  );
}
