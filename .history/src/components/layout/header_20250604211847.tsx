import Link from "next/link";
import { Atom, Cpu, Database } from "lucide-react";
import HeaderDropdownMenu from "./header-dropdown-menu";
import HeaderShoppingCart from "./header-shopping-cart";
import LoginButton from "./login-button";

export default function Header() {
  return (
    <div>
      <>
        <header className="fixed w-full top-0 z-50 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 backdrop-blur-md border-b border-blue-500/20 shadow-2xl">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
            <div className="absolute top-3 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-ping opacity-40"></div>
            <div className="absolute bottom-2 left-1/2 w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse opacity-50"></div>
          </div>

          <div className="container flex items-center justify-between gap-5 h-24 relative">
            {/* Logo with scientific theme */}
            <Link
              href={"/"}
              className="text-4xl font-bold select-none flex ml-4 items-center group transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center gap-2">
                <Atom className="w-8 h-8 text-blue-400 animate-spin-slow group-hover:animate-spin" />
                <span className="text-white font-light tracking-wider">
                  Ge
                </span>
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-black px-3 py-1 rounded-lg font-medium tracking-wide transform group-hover:scale-110 transition-transform">
                  LAB
                </span>
              </div>
            </Link>

            {/* Navigation with scientific icons */}
            <div className="hidden lg:flex gap-8 text-white text-lg">
              <Link
                href={"/"}
                className="flex items-center gap-2 hover:text-blue-400 transition-all duration-200 hover:scale-105 group"
              >
                <Database className="w-4 h-4 group-hover:animate-pulse" />
                Trang chủ
              </Link>
              <Link
                href={"/products"}
                className="flex items-center gap-2 hover:text-cyan-400 transition-all duration-200 hover:scale-105 group"
              >
                <Cpu className="w-4 h-4 group-hover:animate-pulse" />
                Sản phẩm
              </Link>
              <Link
                href={"/about"}
                className="flex items-center gap-2 hover:text-blue-300 transition-all duration-200 hover:scale-105 group"
              >
                <Atom className="w-4 h-4 group-hover:animate-spin" />
                Về chúng tôi
              </Link>
            </div>

            {/* Right side with login, dropdown, and cart */}
            <div className="flex items-center gap-4">
              <LoginButton />
              <HeaderDropdownMenu />
              <HeaderShoppingCart />
            </div>
          </div>

          {/* Bottom glow effect */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"></div>
        </header>
      </>
    </div>
  );
}
