import Image from 'next/image';

interface CastMember {
    id: number;
    name: string;
    profile_path: string | null;
    character: string;
}
interface CastProps {
    cast: CastMember[];
}
  
export default function Cast({ cast } :CastProps) {
  return (
    <div className="cast-section mt-10">
    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 relative inline-block">
        Cast
        <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md"></span>
    </h2>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {cast.map((actor) => (
        <div
            key={actor.id}
            className="actor flex flex-col items-center bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
        >
            {actor.profile_path ? (
            <Image
                src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                alt={actor.name}
                width={200}
                height={300}
                className="rounded-lg object-cover w-full"
            />
            ) : (
            <div className="w-full aspect-w-2 aspect-h-3 min-h-40 h-full bg-gradient-to-b from-gray-300 to-gray-500 flex items-center justify-center rounded-lg">
                <span className="text-white text-lg font-semibold">No Image</span>
            </div>
            )}
            <p className="text-sm sm:text-base font-bold mt-3 text-center">{actor.name}</p>
            <p className="text-xs sm:text-sm text-gray-500 text-center">as {actor.character}</p>
        </div>
        ))}
    </div>
    </div>

  );
}
