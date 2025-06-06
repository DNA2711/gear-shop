import { RxHamburgerMenu } from "react-icons/rx";
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
        <DropdownMenuTrigger>
          <RxHamburgerMenu className="w-8 h-8 cursor-pointer text-white" />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="-translate-x-1/3 ">
          <DropdownMenuLabel>Sản phẩm</DropdownMenuLabel>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>PC</DropdownMenuLabel>
          <DropdownMenuItem>Các sản phẩm khác</DropdownMenuItem>
          <DropdownMenuItem>Các sản phẩm khác</DropdownMenuItem>
          <DropdownMenuItem>Các sản phẩm khác</DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Laptop</DropdownMenuLabel>
          <DropdownMenuItem>Các sản phẩm khác</DropdownMenuItem>
          <DropdownMenuItem>Các sản phẩm khác</DropdownMenuItem>
          <DropdownMenuItem>Các sản phẩm khác</DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem>Các sản phẩm khác</DropdownMenuItem>
          <DropdownMenuItem>Các sản phẩm khác</DropdownMenuItem>
          <DropdownMenuItem>Các sản phẩm khác</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
