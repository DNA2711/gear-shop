import Link from "next/link";
import { IoMailOutline } from "react-icons/io5";
import {
  PiFacebookLogo,
  PiInstagramLogo,
  PiPhone,
  PiTiktokLogo,
  PiYoutubeLogo,
} from "react-icons/pi";

export default function Footer() {
  return (
    <>
      <footer className="bg-[f9f9f9] pt-14 pb-32 bg-[url('/images/footer.png')] bg-left-bottom bg-repeat-x">
        <div className="relative z-10 container grid lg:grid-cols-4 gap-8 ">
          <div className="pl-5 flex flex-col gap-6 lg:col-span-2">
            <h4 className="font-bold text-2xl">Thông tin cửa hàng</h4>

            <div className="flex flex-col gap-4">
              <Link
                href={"#youtube"}
                className="flex items-center text-gray-700 gap-3"
              >
                <PiYoutubeLogo className="w-6 h-6" />
                <span>@GearHub</span>
              </Link>

              <Link
                href={"phone"}
                className="flex items-center text-gray-700 gap-3"
              >
                <PiPhone className="w-6 h-6" />
                <span>0359746693</span>
              </Link>

              <Link
                href={"mail"}
                className="flex items-center text-gray-700 gap-3"
              >
                <IoMailOutline className="w-6 h-6" />

                <span>GearHub@gmail.com</span>
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="font-bold text-2xl">Mạng xã hội</h4>

            <div className="flex gap-3">
              <Link
                href={"#youtube"}
                className="flex items-center text-gray-700 gap-3"
              >
                <PiYoutubeLogo className="w-10 h-10" />
              </Link>

              <Link
                href={"phone"}
                className="flex items-center text-gray-700 gap-3"
              >
                <PiInstagramLogo className="w-10 h-10" />
              </Link>

              <Link
                href={"mail"}
                className="flex items-center text-gray-700 gap-3"
              >
                <PiTiktokLogo className="w-10 h-10" />
              </Link>

              <Link
                href={"mail"}
                className="flex items-center text-gray-700 gap-3"
              >
                <PiFacebookLogo className="w-10 h-10" />
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:text-right">
            <h4 className="font-bold text-2xl">Chính sách</h4>

            <Link href={""}>Chính sách bảo hành</Link>
          </div>

          <div></div>
        </div>
      </footer>
    </>
  );
}
