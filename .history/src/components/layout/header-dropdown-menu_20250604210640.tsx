import { Menu, Monitor, Laptop, Smartphone, Cpu, HardDrive, Gamepad2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function HeaderDropdownMenu() {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2 rounded-lg hover:bg-blue-500/20 transition-all duration-200 group">
          <Menu className="w-6 h-6 cursor-pointer text-blue-400 group-hover:text-blue-300 transition-colors" />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-64 bg-gray-900 border-gray-700 text-white shadow-2xl">
          <DropdownMenuLabel className="text-blue-400 text-lg font-semibold">
            Danh mục sản phẩm
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-gray-700" />
          
          <DropdownMenuLabel className="text-cyan-400 flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Desktop PC
          </DropdownMenuLabel>
          <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer pl-6">
            <Cpu className="w-4 h-4 mr-2 text-blue-300" />
            Gaming PC
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer pl-6">
            <HardDrive className="w-4 h-4 mr-2 text-blue-300" />
            Workstation
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer pl-6">
            <Gamepad2 className="w-4 h-4 mr-2 text-blue-300" />
            Mini PC
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-gray-700" />
          
          <DropdownMenuLabel className="text-cyan-400 flex items-center gap-2">
            <Laptop className="w-4 h-4" />
            Laptop
          </DropdownMenuLabel>
          <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer pl-6">
            <Monitor className="w-4 h-4 mr-2 text-green-300" />
            Gaming Laptop
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer pl-6">
            <Cpu className="w-4 h-4 mr-2 text-green-300" />
            Business Laptop
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer pl-6">
            <HardDrive className="w-4 h-4 mr-2 text-green-300" />
            Ultrabook
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-gray-700" />
          
          <DropdownMenuLabel className="text-cyan-400 flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            Phụ kiện
          </DropdownMenuLabel>
          <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer pl-6">
            <Monitor className="w-4 h-4 mr-2 text-purple-300" />
            Màn hình
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer pl-6">
            <Gamepad2 className="w-4 h-4 mr-2 text-purple-300" />
            Gaming Gear
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
