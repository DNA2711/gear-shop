import Link from "next/link";
import HeaderDropdownMenu from "./header-dropdown-menu";
import HeaderShoppingCart from "./header-shopping-cart";

export default function Header() {
  return (
    <div>
      <>
        <header className="fixed w-full top-0 z-50 bg-black shadow">
          <div className="container flex items-center justify-between gap-5 h-24">
            <Link
              href={"/"}
              className="text-4xl font-bold select-none flex ml-4 items-center  bg-black p-2 rounded"
            >
              <span className="text-white">Gear</span>

              <span className="bg-[#FF9900] text-black px-3 ml-2 rounded-sm select-text">
                hub
              </span>
            </Link>

            <div className="hidden lg:flex gap-12 text-white text-xl">
              <Link href={"/"}>Trang chủ</Link>
              <Link href={"/products"}>Sản phẩm</Link>
              <Link href={"/about"}>About</Link>
            </div>

            <div className="flex items-center gap-5">
              <HeaderDropdownMenu />
              <HeaderShoppingCart />
            </div>
          </div>
        </header>
      </>
    </div>
  );
}
