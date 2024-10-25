import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/image";

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
  const router = useRouter();

  const fetchMovies = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${page}`
      );
      const data = await res.json();
      if (data.results.length === 0) {
        setHasMore(false); // No more movies to load
      } else {
        setMovies((prevMovies) => [...prevMovies, ...data.results]); // Append new movies to the list
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  // Fetch movies initially when the component mounts and when the page changes
  useEffect(() => {
    fetchMovies();
  }, [page]);

  // Function to load more movies
  const loadMoreMovies = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="movie-list">
      <h1 className="text-3xl font-bold mb-6">Popular Movies</h1>

      <InfiniteScroll
        dataLength={movies.length} // This is the current length of the movies list
        next={loadMoreMovies} // This function will load more movies
        hasMore={hasMore} // Determines whether more movies are available to load
        loader={<h4>Loading...</h4>} // Loader text while fetching more data
        endMessage={<p>End of movies</p>} // Message when no more movies are available
      >
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
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
                    <h3 className="text-lg font-semibold text-gray-800 hover:cursor-pointer hover:text-blue-800" onClick={() => router.push(`/movies/${movie.id}`)}>{movie.title}</h3>
                    <p  className="text-sm text-gray-600">{movie.release_date}</p>
                    <p className="text-sm text-gray-500">Rating: {movie.vote_average}</p>
                    
                    <div className="flex space-x-4 mt-2 lg:space-x-0 lg:mt-0">
                      {/* For Small and Medium Screens - Show Language */}
                      <div className="bg-green-100 text-green-800 text-xs font-semibold px-4 py-2 rounded-md block lg:hidden">
                        <p>Language: {getFullLanguageName(movie.original_language)}</p>
                      </div>

                      {/* For Large Screens - Show Description */}
                      <div className="text-xs  py-2 hidden lg:block">
                        <p>{movie.overview.length > 100
                          ? movie.overview.substring(0, 100) + "..."
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
