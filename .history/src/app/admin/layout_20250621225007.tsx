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
      <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-gray-800">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-gray-800 p-6">
            {children}
          </main>
        </div>
        <GlobalLoading />
      </div>
    </AdminProtectedRoute>
  );
}
