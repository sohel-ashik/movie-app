import Image from 'next/image';
import { useRouter } from 'next/router';

interface Recommendation {
  id: number;
  title: string;
  poster_path: string | null;
}

interface RecommendationsProps {
  recommendations: Recommendation[];
}

export default function Recommendations({ recommendations } : RecommendationsProps) {
  const router = useRouter();
  
  return (
    <div className="recommendations mt-12">
        <h2 className="text-2xl font-bold mb-4 border-b-4 border-blue-500 pb-2 inline-block">Recommendations</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {recommendations.map((rec) => (
            <div
            key={rec.id}
            className="recommendation-card group cursor-pointer transition-transform transform hover:scale-105 rounded-lg overflow-hidden shadow-lg hover:shadow-xl"
            onClick={() => router.push(`/movies/${rec.id}`)}
            >
            <div className="relative">
                <Image
                src={`https://image.tmdb.org/t/p/w300${rec.poster_path}`}
                alt={rec.title}
                width={300}
                height={450}
                className="w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white text-base font-semibold">{rec.title}</p>
                </div>
            </div>
            <p className="text-center text-sm font-medium mt-2 py-2">{rec.title}</p>
            </div>
        ))}
        </div>
    </div>
  
  );
}
