import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/image";
import HomeSkeleton from "./HomeSkeleton";

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
    // Add more languages as needed
  };

  return languageMap[languageCode] || languageCode;
};

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState(""); // Search query
  const [searching, setSearching] = useState(false); // Toggle for search mode
  const router = useRouter();
  const [searchRefresh, setSerachRefresh] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch popular movies or search results based on the current state
  const fetchMovies = async () => {
    try {
      let url = `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${page}`;
      if (searching && query.trim()) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${query}&page=${page}`;
      }
      
      setLoading(true);
      const res = await fetch(url);
      setLoading(false);
      const data = await res.json();

      if (data.results.length === 0) {
        setHasMore(false); // No more movies to load
      } else {
        if (page === 1) {
          setMovies(data.results); // Replace movie list if it's the first page
        } else {
          setMovies((prevMovies) => [...prevMovies, ...data.results]); // Append more movies for pagination
        }
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setLoading(false);
    }
  };

  // Load more movies when scrolling
  const loadMoreMovies = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // Reset search
  const clearSearch = () => {
    setQuery("");
    setSearching(false);
    setPage(1);
    setHasMore(true);
    setMovies([]); // Clear current movie list
  };

  // Trigger search
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset page
    setMovies([]); // Clear current movies for new search
    setSearching(true);
    setSerachRefresh(pre=>!pre)
  };

  // Fetch movies initially or when page or searching state changes
  useEffect(() => {
    fetchMovies();
  }, [page, searching,searchRefresh]);

  return (
    <div className="movie-list">
      {/* <h1 className="text-3xl font-bold mb-6">Popular Movies</h1> */}

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="py-4 z-50 shadow-md shadow-gray-200 mb-6 bg-gray-50 lg:px-0 px-5 flex justify-center space-x-2 fixed left-0 right-0">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
          className="border border-gray-400 px-4 py-2 rounded-md w-full lg:w-1/2"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
        >
          Search
        </button>
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
          >
            Clear
          </button>
        )}
      </form>

      <InfiniteScroll
        dataLength={movies.length}
        next={loadMoreMovies}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center">
            <div className="lg:w-[600px]">
            <HomeSkeleton/>
            </div>
          </div>
        }
        endMessage={
          !loading && <div className="flex justify-center py-10">
            <p>No more movies.</p>
          </div>
        }
      >
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl md:mt-30 mt-20">
          <ul>
            {movies.map((movie) => (
              <li
                key={movie.id}
                className="mb-6 p-4 border-b border-gray-300 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                    className="w-20 h-auto rounded-md hover:cursor-pointer"
                    onClick={() => router.push(`/movies/${movie.id}`)}
                  />
                  <div>
                    <h3
                      className="text-lg font-semibold text-gray-800 hover:cursor-pointer hover:text-blue-800"
                      onClick={() => router.push(`/movies/${movie.id}`)}
                    >
                      {movie.title}
                    </h3>
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
              </li>
            ))}
          </ul>
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default HomePage;
