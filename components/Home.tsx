import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // To handle whether more data is available

  // Function to fetch movies from TMDB API
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
        <ul>
          {movies.map((movie) => (
            <li key={movie.id} className="mb-4">
              <h3>{movie.title}</h3>
              <p>{movie.release_date}</p>
            </li>
          ))}
        </ul>
      </InfiniteScroll>
    </div>
  );
};

export default HomePage;
