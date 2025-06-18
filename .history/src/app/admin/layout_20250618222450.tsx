import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";
import { AdminProtectedRoute } from "@/components/auth/AdminProtectedRoute";
import { GlobalLoading } from "@/components/admin/GlobalLoading";
import { NavigationLoadingProvider } from "@/components/providers/NavigationLoadingProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProtectedRoute>
      <NavigationLoadingProvider>
        <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 p-6">
              {children}
            </main>
          </div>
          <GlobalLoading />
        </div>
      </NavigationLoadingProvider>
    </AdminProtectedRoute>
  );
}
