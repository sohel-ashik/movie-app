import Navbar from '@/components/Nav';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AiOutlinePlus, AiOutlineCheck } from 'react-icons/ai';
import Cast from '@/components/Cast';
import Recommendations from '@/components/Recommendations';
import Image from 'next/image';
import MovieDetailsSkeleton from '@/components/MovieDetailsSkeleton';
import { MdImageNotSupported } from 'react-icons/md';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

type Genre = {
  id: number;
  name: string;
};

type Movie = {
  id: number;
  title: string;
  release_date: string;
  runtime: number;
  genres: Genre[];
  vote_average: number;
  vote_count: number;
  tagline?: string;
  overview: string;
  revenue: number;
  poster_path?: string;
  homepage?: string;
};

interface CastMember {
  id: number;
  name: string;
  profile_path: string | null;
  character: string;
}
interface Recommendation {
  id: number;
  title: string;
  poster_path: string | null;
}

type MovieDetailsProps = {
  movie: Movie;
  cast: CastMember[];
  recommendations: Recommendation[];
};

export default function MovieDetails({ movie, cast, recommendations }: MovieDetailsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);

  // Add to watchlist function
  const addToWatchlist = async (movie: Movie) => {
    try {
      await fetch("/api/watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movie }),
      });
    } catch (error) {
      console.error("Error adding to watchlist:", error);
    }
  };

  // Delete from watchlist function
  const handleDelete = async (movieId: number) => {
    try {
      await fetch(`/api/watchlist?id=${movieId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  const handleClick = () => {
    if (isFavourite) {
      handleDelete(movie?.id);
    } else {
      addToWatchlist(movie);
    }
    setIsFavourite(!isFavourite);
  };

  // Loading state when routing
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  // Check if movie is in watchlist
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!movie?.id) return;
      try {
        const response = await fetch(`/api/watchlist?id=${movie?.id}`);
        const data = await response.json();
        setIsFavourite(data?.available);
      } catch (error) {
        console.error('Error fetching movie availability:', error);
      }
    };
    fetchAvailability();
  }, [movie]);

  if (router.isFallback || loading) {
    return (
      <div>
        <Navbar />
        <MovieDetailsSkeleton />
      </div>
    );
  }

  return (
    <div className="xl:px-64 xxl:px-80">
      <Navbar />
      <div className="container mx-auto p-4 mt-20">
        <div className="movie-details flex flex-col md:flex-row">
          <div className="poster xl:w-[400px] ">
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={300}
                height={450}
                className="rounded-lg w-full"
              />
            ) : (
              <div className="w-full md:w-[300px] h-[450px] flex items-center justify-center border bg-red-950 rounded-lg">
                <MdImageNotSupported className="text-gray-400" size={40} />
              </div>
            )}
          </div>

          <div className="movie-info flex-1 md:ml-6 mt-10 md:mt-0">
            <div className="flex flex-col justify-start items-start">
              <h1 className="text-3xl font-bold leading-tight mb-2">{movie.title}</h1>
              {/* <button
                onClick={handleClick}
                className={`hidden md:flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white transition-all duration-300
                  ${
                    isFavourite
                      ? 'bg-gradient-to-r from-red-950 to-gray-900 hover:from-red-800 hover:to-gray-700'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                  }
                `}
              >
                {isFavourite ? <AiOutlineCheck size={20} /> : <AiOutlinePlus size={20} />}
                {isFavourite ? 'Remove from Watchlist' : 'Add to Watchlist'}
              </button> */}
            </div>

            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
              <p className="mr-4">Release Date: {movie.release_date}</p>
              <p className="mr-4">Runtime: {movie.runtime} min</p>
            </div>

            <div className="genres flex flex-wrap gap-2 mb-4">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="inline-block bg-blue-200 text-blue-800 text-sm px-2 py-1 rounded"
                >
                  {genre.name}
                </span>
              ))}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <p className="flex items-center gap-1">
                  <span className="font-bold text-gray-700">★ {movie.vote_average}</span> (
                  {movie.vote_count} votes)
                </p>
              </div>
            </div>

            {movie.tagline && (
              <div className="tagline mt-4 mb-4">
                <p className="italic text-gray-600">{movie.tagline}</p>
              </div>
            )}

            <p className="overview mb-4 text-base text-gray-700">{movie.overview}</p>

            <div className="text-sm text-gray-500 mb-4">
              <p>Revenue: ${movie.revenue.toLocaleString()}</p>
            </div>

            {movie.homepage && (
              <div className="homepage mb-6">
                <a
                  href={movie.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-blue-600 hover:underline text-sm"
                >
                  Official Website
                </a>
              </div>
            )}

            <button
              onClick={handleClick}
              className={`flex  mt-5 text-sm items-center justify-center gap-2 px-4 py-2 rounded-md text-white transition-all duration-300
                ${
                  isFavourite
                    ? 'bg-gradient-to-r from-red-950 to-gray-900 hover:from-red-800 hover:to-gray-700'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                }
              `}
            >
              {isFavourite ? <AiOutlineCheck size={20} /> : <AiOutlinePlus size={20} />}
              {isFavourite ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </button>
          </div>
        </div>

        <Cast cast={cast} />
        <Recommendations recommendations={recommendations} />
      </div>
    </div>
  );
}

// Pre-render paths
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params as { id: string };
  try {
    const resMovie = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
    const movie = await resMovie.json();
    const resCast = await fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`);
    const castData = await resCast.json();
    const cast = castData.cast.slice(0, 8);
    const resRecommendations = await fetch(
      `${BASE_URL}/movie/${movie.id}/recommendations?api_key=${API_KEY}`
    );
    const recommendationsData = await resRecommendations.json();
    const recommendations = recommendationsData.results.slice(0, 8);

    return {
      props: {
        movie,
        cast,
        recommendations,
      },
      revalidate: 60,
    };
  } catch (err) {
    console.log(err);
    return {
      notFound: true,
    };
  }
};
