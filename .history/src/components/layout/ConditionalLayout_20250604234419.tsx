'use client'

import { usePathname } from 'next/navigation'
import Header from './header'
import Footer from './footer'

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/admin')

  if (isAdminRoute) {
    // Chỉ trả về children cho trang admin (không có Header/Footer)
    return <>{children}</>
  }

  // Trả về layout đầy đủ cho các trang khác
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="mt-24">{children}</main>
      <Footer />
    </div>
  )
} 