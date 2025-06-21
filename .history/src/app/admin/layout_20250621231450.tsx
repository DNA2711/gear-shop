import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";
import { AdminProtectedRoute } from "@/components/auth/AdminProtectedRoute";
import { GlobalLoading } from "@/components/admin/GlobalLoading";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProtectedRoute>
      <div className="min-h-screen seamless-background">
        <div className="flex">
          <Sidebar />
          <div className="flex-1 flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto">
              <div className="container mx-auto px-6 py-8">{children}</div>
            </main>
          </div>
        </div>
        <GlobalLoading />
      </div>
    </AdminProtectedRoute>
  );
}
