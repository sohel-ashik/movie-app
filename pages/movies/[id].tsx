import Navbar from '@/components/Nav';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AiOutlinePlus, AiOutlineCheck } from 'react-icons/ai';

function CircularLoader() {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500'></div>
      </div>
    );
  }
  
// TMDB API configuration
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

type MovieDetailsProps = {
  movie: {
    title: string;
    poster_path: string;
    overview: string;
    release_date: string;
    genres: { id: number; name: string }[];
  };
  recommendations: { id: number; title: string; poster_path: string }[];
  cast: { id: number; name: string; character: string; profile_path: string }[];
};

export default function MovieDetails({ movie, recommendations, cast }: MovieDetailsProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false); // Loading state
//   const router = useRouter();
  const [isFavourite, setIsFavourite] = useState(false);

  const addToWatchlist = async (movie:any) => {
    try {
      // setIsFavourite(true);
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movie }),
      });

      if (res.ok) {
        // alert(`${movie.title} has been added to your watchlist!`);
      }
    } catch (error) {
      // setIsFavourite(false);
      console.error("Error adding to watchlist:", error);
    }
  };

  

  const handleDelete = async (movieId: number) => {
    try {
        const response = await fetch(`/api/watchlist?id=${movieId}`, {
          method: "DELETE",
        });
        const data = await response.json();
        // setIsFavourite(false);
        if (response.ok) {
          // setIsFavourite(false); 
        } else {
          console.error("Error deleting movie:", data.message);
          // setIsFavourite(true);
        }
      } catch (error) {
        console.error("Error deleting movie:", error);
        // setIsFavourite(true);
      }
  
  };

  const handleClick = () => {
    if (isFavourite) {
      handleDelete(movie?.id); // Remove from watchlist
    } else {
      addToWatchlist(movie); // Add to watchlist
    }
    setIsFavourite(!isFavourite); // Toggle the favourite state
  };

  // Show loader when route is changing
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    // Clean up event listeners
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  useEffect(()=>{
    const fetchAvailability = async () => {
      if (!movie?.id) return; // Ensure movieId is defined

      try {
        const response = await fetch(`/api/watchlist?id=${movie?.id}`);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setIsFavourite(data?.available);
        console.log('yy', data)
      } catch (error) {
        console.error('Error fetching movie availability:', error);
      }
    };

    fetchAvailability();
  },[isFavourite,movie])

  // If the page is loading, return a fallback UI
  if (router.isFallback || loading) {
    return <div><CircularLoader/></div>;
  }

  return (
    <div >
      <Navbar/>
      <div className="container mx-auto p-4 mt-20">
        <div className="movie-details flex flex-col md:flex-row">
          {/* Movie Poster */}
          <div className="poster xl:w-[400px]">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={300}
              height={450}
              className="rounded-lg w-full"
            />
          </div>

          {/* Movie Info */}
          <div className="movie-info flex-1 ml-6">
            <div className='flex justify-between'>
              
                <h1 className="text-3xl font-bold" onClick={()=>console.log("poster_path",`https://image.tmdb.org/t/p/w500${movie.poster_path}`)}>{movie.title}</h1>
                <button
                  onClick={handleClick}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white transition-all duration-300
                    ${isFavourite ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} 
                  `}
                >
                  {isFavourite ? <AiOutlineCheck size={20} /> : <AiOutlinePlus size={20} />}
                  {isFavourite ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </button>
            </div>
                <p className="text-sm text-gray-500 mb-2">Release Date: {movie.release_date}</p>
                <div className="genres mb-4">
                  {movie.genres.map((genre) => (
                    <span key={genre.id} className="inline-block bg-blue-200 text-blue-800 text-sm px-2 py-1 rounded mr-2">
                      {genre.name}
                    </span>
                  ))}
                </div>
              
                <p className="overview" onClick={()=>console.log(movie)}>{movie.overview}</p>

            {/* Cast */}
            <h2 className="text-xl font-semibold mt-6">Cast</h2>
            <div className="cast grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cast.map((actor) => (
                <div key={actor.id} className="actor hover:cursor-pointer h-full" onClick={()=>console.log(actor.profile_path)}>
                
                  <Image
                  src={
                      actor.profile_path
                      ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                      : '/no_photos.png' 
                  }
                  alt={actor.name}
                  width={100}
                  height={150}
                  className="rounded-lg h-full object-contain"
                  />
                  <p className="text-sm font-bold">{actor.name}</p>
                  <p className="text-xs text-gray-500">as {actor.character}</p>
                </div>
              ))}
            </div>
            
          </div>
        </div>

        {/* Recommendations */}
        <div className="recommendations mt-12">
          <h2 className="text-2xl font-bold">Recommendations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="recommendation hover:cursor-pointer" onClick={()=>{
                  router.push(`/movies/${rec.id}`);
                }}>
                <Image
                  src={`https://image.tmdb.org/t/p/w300${rec.poster_path}`}
                  alt={rec.title}
                  width={150}
                  height={225}
                  className="rounded-lg"
                />
                <p className="text-sm mt-2">{rec.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Pre-render movie details pages at build time
export const getStaticPaths: GetStaticPaths = async () => {
  // Fetch a few popular movies to pre-render their pages
  // const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=1`);
  // const data = await res.json();

  // const paths = data.results.map((movie: { id: number }) => ({
  //   params: { id: movie.id.toString() },
  // }));

  return {
    paths: [],
    fallback: true, // Enable ISR for movies not pre-rendered
  };
};

// Fetch movie details, cast, and recommendations
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params as { id: string };
  console.log('xx',`${BASE_URL}/movie/${id}?api_key=${API_KEY}`)

  // Fetch movie details
  const resMovie = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
  const movie = await resMovie.json();


  // Fetch movie cast
  const resCast = await fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`);
  const castData = await resCast.json();
  const cast = castData.cast.slice(0, 8); // Limit to 8 cast members

  // Fetch movie recommendations
  const resRecommendations = await fetch(`${BASE_URL}/movie/${movie.id}/recommendations?api_key=${API_KEY}`);
  const recommendationsData = await resRecommendations.json();
  const recommendations = recommendationsData.results.slice(0, 8); // Limit to 8 recommendations

  return {
    props: {
      movie,
      recommendations,
      cast,
    },
    revalidate: 60, // ISR: revalidate every 60 seconds
  };
};
