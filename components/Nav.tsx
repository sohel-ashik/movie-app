import { AiFillHome } from "react-icons/ai";
import Link from "next/link"; // Import Next.js Link component
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Home Icon */}
        <div
          className="text-gray-800 text-2xl font-bold flex items-center space-x-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <AiFillHome className="text-blue-600" />
          <span className="text-lg font-semibold">Movies</span>
        </div>

        {/* Additional Nav Links */}
        <div className="flex space-x-6">
          <Link href="/watchlist" passHref>
            <div className="text-gray-700 hover:text-blue-600 font-medium">
              Watchlist
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
