"use client";

import { useState } from "react";
import { User, LogIn, UserCircle, Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function LoginButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    // Simulate login process
    setIsLoggedIn(true);
    setUsername("User123");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
  };

  if (!isLoggedIn) {
    return (
      <Button
        onClick={handleLogin}
        variant="outline"
        className="bg-transparent border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black transition-all duration-200"
      >
        <LogIn className="w-4 h-4 mr-2" />
        Đăng nhập
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-blue-400 hover:bg-blue-400/10 transition-all duration-200"
        >
          <UserCircle className="w-5 h-5 mr-2" />
          {username}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700 text-white">
        <DropdownMenuLabel className="text-blue-400">
          Tài khoản
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />

        <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
          <User className="w-4 h-4 mr-2" />
          Hồ sơ cá nhân
        </DropdownMenuItem>

        <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
          <Settings className="w-4 h-4 mr-2" />
          Cài đặt
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-700" />

        <DropdownMenuItem
          onClick={handleLogout}
          className="hover:bg-red-900 cursor-pointer text-red-400 hover:text-red-300"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
