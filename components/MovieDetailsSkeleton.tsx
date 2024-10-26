
const MovieDetailsSkeleton = () => {
  
    return (
        <div className="container mx-auto p-4 mt-20 animate-pulse">
        <div className="movie-details flex flex-col md:flex-row gap-6">
          
          {/* Poster Skeleton */}
          <div className="poster-skeleton xl:w-[400px] w-full h-[450px] bg-gray-300 rounded-lg"></div>
      
          {/* Movie Info Skeleton */}
          <div className="movie-info-skeleton flex-1 space-y-4">
            <div className="w-3/4 h-8 bg-gray-300 rounded"></div> {/* Title Skeleton */}
            <div className="flex space-x-4">
              <div className="w-1/4 h-6 bg-gray-300 rounded"></div> {/* Release Date Skeleton */}
              <div className="w-1/4 h-6 bg-gray-300 rounded"></div> {/* Runtime Skeleton */}
            </div>
            <div className="flex space-x-2 flex-wrap">
              <div className="w-16 h-6 bg-gray-300 rounded"></div> {/* Genre Skeleton */}
              <div className="w-16 h-6 bg-gray-300 rounded"></div>
              <div className="w-16 h-6 bg-gray-300 rounded"></div>
            </div>
            <div className="w-1/2 h-6 bg-gray-300 rounded"></div> {/* Tagline Skeleton */}
            <div className="w-full h-24 bg-gray-300 rounded"></div> {/* Overview Skeleton */}
            <div className="w-1/4 h-6 bg-gray-300 rounded"></div> {/* Revenue Skeleton */}
          </div>
      
        </div>
      
        {/* Cast Skeleton */}
        <div className="cast-section-skeleton mt-10 space-y-6">
          <div className="w-32 h-6 bg-gray-300 rounded"></div> {/* Cast Title Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="space-y-3">
                <div className="w-full h-[300px] bg-gray-300 rounded-lg"></div> {/* Image Skeleton */}
                <div className="w-3/4 h-6 bg-gray-300 rounded mx-auto"></div> {/* Name Skeleton */}
                <div className="w-2/3 h-4 bg-gray-300 rounded mx-auto"></div> {/* Character Skeleton */}
              </div>
            ))}
          </div>
        </div>
      
        {/* Recommendations Skeleton */}
        <div className="recommendations-skeleton mt-12 space-y-6">
          <div className="w-48 h-8 bg-gray-300 rounded"></div> {/* Recommendations Title Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="space-y-3">
                <div className="w-full h-[450px] bg-gray-300 rounded-lg"></div> {/* Poster Skeleton */}
                <div className="w-3/4 h-6 bg-gray-300 rounded mx-auto"></div> {/* Title Skeleton */}
              </div>
            ))}
          </div>
        </div>
      </div>
      
    );
  };
  
  export default MovieDetailsSkeleton;
  