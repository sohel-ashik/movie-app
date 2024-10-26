import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Nav";
import { FiTrash } from "react-icons/fi";

const getFullLanguageName = (languageCode: string) => {
    const languageMap: { [key: string]: string } = {
      en: "English",
      fr: "French",
      es: "Spanish",
      de: "German",
      it: "Italian",
      ja: "Japanese",
      ko: "Korean",
      zh: "Chinese",
    };
  
    return languageMap[languageCode] || languageCode;
  };
  

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([]);
  const router = useRouter();

  // Fetch watchlist on page load
  useEffect(() => {
    const fetchWatchlist = async () => {
      const response = await fetch("/api/watchlist");
      const data = await response.json();
      console.log("xx", data);
      setWatchlist(data);
    };

    fetchWatchlist();
  }, []);

  const handleDelete = async (movieId: number) => {
    try {
        const response = await fetch(`/api/watchlist?id=${movieId}`, {
          method: "DELETE",
        });
        const data = await response.json();
    
        if (response.ok) {
          setWatchlist(watchlist.filter((movie) => movie.id !== movieId)); // Update the state after deletion
        } else {
          console.error("Error deleting movie:", data.message);
        }
      } catch (error) {
        console.error("Error deleting movie:", error);
      }
    
    // setWatchlist(watchlist.filter((movie) => movie.id !== movieId)); // Update state after delete
  };

  return (
    <div>
        <Navbar/>
        <div className="container  flex flex-col items-center justify-center mx-auto px-4 lg:px-8 max-w-2xl md:mt-30 mt-20">
        <h1 className="text-2xl font-bold mb-6 w-full px-4">My Watchlist</h1>

        {watchlist.length === 0 ? (
            <p>No movies in your watchlist</p>
        ) : (
            <ul className="w-full">
            {watchlist.map((movie) => (
                <li
                key={movie.id}
                className="mb-6 p-4  border-b border-gray-300 hover:shadow-lg transition-shadow duration-300"
                >
                <div className="flex items-start space-x-4">
                    <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                    className="w-20 h-auto rounded-md hover:cursor-pointer"
                    onClick={() => router.push(`/movies/${movie.id}`)}
                    />
                    <div>
                    <div className="flex justify-between">
                        <h3
                            className="text-lg font-semibold text-gray-800 hover:cursor-pointer hover:text-blue-800"
                            onClick={() => router.push(`/movies/${movie.id}`)}
                        >
                            {movie.title}
                        </h3>
                        <button
                            onClick={() => handleDelete(movie.id)}
                            className="hidden lg:flex items-center space-x-2 bg-gradient-to-r from-red-300 via-pink-400 to-red-500 hover:from-red-400 hover:via-pink-500 hover:to-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
                        >
                            <FiTrash className="text-white text-lg" />
                            <span>Delete</span>
                        </button>
                    </div>
                    <p className="text-sm text-gray-600">{movie.release_date}</p>
                    <p className="text-sm text-gray-500">Rating: {movie.vote_average}</p>

                    <div className="flex space-x-4 mt-2 lg:space-x-0 lg:mt-0">
                        {/* For Small and Medium Screens - Show Language */}
                        <div className="bg-green-100 text-green-800 text-xs font-semibold px-4 py-2 rounded-md block lg:hidden">
                        <p>{getFullLanguageName(movie.original_language)}</p>
                        </div>

                        {/* For Large Screens - Show Description */}
                        <div className="text-xs py-2 hidden lg:block">
                        <p>
                            {movie.overview.length > 100
                            ? movie.overview.substring(0, 150) + "..."
                            : movie.overview}
                        </p>
                        </div>

                        
                    </div>
                    </div>
                </div>
                <button
                    onClick={() => handleDelete(movie.id)}
                    className="lg:hidden flex mt-2 w-full justify-center items-center space-x-2 bg-rose-500 hover:bg-rose-600 text-white shadow-md hover:shadow-lg
 font-medium py-2 px-4 rounded-md transition-colors duration-300"
                >
                    <FiTrash className="text-white text-lg" />
                    <span>Delete</span>
                </button>
                </li>
            ))}
            </ul>
        )}
        </div>
    </div>
  );
};

export default WatchlistPage;

