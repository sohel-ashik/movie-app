import { useRouter } from "next/router";
import { useState, useEffect, FormEvent } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import HomeSkeleton from "./HomeSkeleton";
import { FaBookmark } from "react-icons/fa6";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { MdImageNotSupported } from "react-icons/md";

interface Movie {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  poster_path: string | null;
  original_language: string;
  overview: string;
}

const getFullLanguageName = (languageCode: string): string => {
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

const HomePage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const [searching, setSearching] = useState<boolean>(false);
  const router = useRouter();
  const [searchRefresh, setSearchRefresh] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [favouriteIds, setFavouriteIds] = useState<Map<number, boolean>>(new Map());

  const fetchMovies = async () => {
    try {
      const url =
        searching && query.trim()
          ? `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${query}&page=${page}`
          : `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${page}`;

      setLoading(true);
      const res = await fetch(url);
      setLoading(false);
      const data = await res.json();

      if (data.results.length === 0) {
        setHasMore(false);
      } else {
        setMovies(page === 1 ? data.results : [...movies, ...data.results]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchWatchlistIds = async () => {
      try {
        const response = await fetch("/api/watchlist?gettype=getFavouriteIds");
        const data = await response.json();

        if (Array.isArray(data)) {
          const idsMap = new Map(data.map((item: number) => [item, true]));
          setFavouriteIds(idsMap);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchWatchlistIds();
  }, []);

  const loadMoreMovies = () => setPage((prevPage) => prevPage + 1);

  const clearSearch = () => {
    setQuery("");
    setSearching(false);
    setPage(1);
    setHasMore(true);
    setMovies([]);
    setSearchRefresh((prev) => !prev);
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setPage(1);
    setMovies([]);
    setSearching(true);
    setSearchRefresh((prev) => !prev);
  };

  useEffect(() => {
    fetchMovies();
  }, [page, searching, searchRefresh]);

  useEffect(() => {
    if (!query.length) {
      fetchMovies();
    }
  }, [query]);

  return (
    <div className="movie-list">
      <form
        onSubmit={handleSearch}
        className="py-4 z-50 shadow-md shadow-red-950 bg-gradient-to-r from-red-950 to-red-800 mb-6 lg:px-0 px-5 flex justify-center fixed left-0 right-0"
      >
        <div className="relative w-full md:w-[530px]">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies..."
            className="border focus:outline-none border-gray-400 px-4 py-2 rounded-tl-md rounded-bl-md w-full pr-10"
          />

          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <AiOutlineClose size={20} />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-red-950 to-gray-900 text-white rounded-tr-md rounded-br-md hover:from-red-800 hover:to-gray-700 flex items-center transition-all duration-300"
        >
          <AiOutlineSearch size={20} />
        </button>
      </form>

      <InfiniteScroll
        dataLength={movies.length}
        next={loadMoreMovies}
        hasMore={hasMore}
        loader={
          loading && movies.length === 0 && (
            <div className="flex justify-center">
              <div className="lg:w-[600px]">
                <HomeSkeleton />
              </div>
            </div>
          )
        }
        endMessage={
          !loading && (
            <div className="flex justify-center py-10">
              <p>No more movies.</p>
            </div>
          )
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
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      alt={movie.title}
                      className="w-20 h-auto rounded-md hover:cursor-pointer"
                      onClick={() => router.push(`/movies/${movie.id}`)}
                    />
                  ) : (
                    <div className="min-w-20 h-28 flex items-center justify-center border bg-red-950 rounded-md">
                      <MdImageNotSupported className="text-white" size={24} />
                    </div>
                  )}
                  <div className="w-full">
                    <div className="flex justify-between gap-4">
                      <h3
                        className="text-lg font-semibold text-gray-800 hover:cursor-pointer hover:text-blue-800"
                        onClick={() => router.push(`/movies/${movie.id}`)}
                      >
                        {movie.title}
                      </h3>
                      <div className="pt-2">
                        {favouriteIds.get(movie.id) && <FaBookmark size={18} />}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{movie.release_date}</p>
                    <p className="text-sm text-gray-500">Rating: {movie.vote_average}</p>

                    <div className="flex space-x-4 mt-2 lg:space-x-0 lg:mt-0">
                      <div className="bg-green-100 text-green-800 text-xs font-semibold px-4 py-2 rounded-md block lg:hidden">
                        <p>{getFullLanguageName(movie.original_language)}</p>
                      </div>
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
          {loading && movies.length === 0 && (
            <div className="flex justify-center">
              <div className="lg:w-[600px]">
                <HomeSkeleton />
              </div>
            </div>
          )}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default HomePage;
