const HomeSkeleton = () => {
    return (
      <ul>
        {[1, 2, 3, 4, 5].map((_, index) => (
          <li
            key={index}
            className="mb-6 p-4 border-b border-gray-300 hover:shadow-lg transition-shadow duration-300 "
          >
            <div className="flex items-start space-x-4 animate-pulse">
              {/* Skeleton for Movie Poster */}
              <div className="w-20 h-28 bg-gray-300 rounded-md" />
              
              <div className="flex-1 space-y-4">
                {/* Skeleton for Movie Title */}
                {/* <div className="h-4 bg-gray-300 rounded w-3/4"></div> */}
  
                {/* Skeleton for Movie Release Date */}
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
  
                {/* Skeleton for Movie Rating */}
                <div className="h-3 bg-gray-200 rounded w-1/5"></div>
  
                {/* Skeleton for Overview (Large Screen) */}
                <div className="hidden lg:block">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-11/12 mt-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-10/12 mt-2"></div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  };
  

  export default HomeSkeleton;