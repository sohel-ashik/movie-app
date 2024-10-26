import { BiMoviePlay } from "react-icons/bi";
import { IoBookmarks } from "react-icons/io5";
import Link from "next/link"; // Import Next.js Link component
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="bg-gradient-to-r from-red-950 to-red-800 shadow-lg fixed top-0 left-0 w-full z-50  shadow-gray-500">
        <div className="container mx-auto px-4 xl:px-36 py-3 flex justify-between items-center">
            {/* Home Icon */}
            <div
            className="text-white hover:text-red-200 text-2xl font-bold flex items-center space-x-2 cursor-pointer"
            onClick={() => router.push("/")}
            >
            <BiMoviePlay className="" />
            <span className="text-lg font-semibold">Movies</span>
            </div>

            {/* Additional Nav Links */}
            <div className="flex space-x-6">
            <Link href="/watchlist" passHref>
                <div className="text-white hover:text-red-200 font-medium flex justify-center items-center gap-1 transition-colors duration-200">
                    <IoBookmarks className=""/>
                <span>Watchlist</span>
                </div>
            </Link>
            </div>
        </div>
    </nav>

  );
};

export default Navbar;
