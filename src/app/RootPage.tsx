import { fetchMovies } from "@modules/movies/lib/movies-data";
import type { Movie } from "@modules/movies/types/moive";
import { MovieCard } from "@modules/movies/ui/MovieCard";
import { useEffect, useState } from "react";

export default function RootPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMovies()
      .then((data) => setMovies(data))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='mb-8 text-3xl font-bold'>Афиша</h1>

      {isLoading ? (
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='animate-pulse'>
              <div className='aspect-[3/4] rounded-2xl bg-muted' />
              <div className='mt-3 h-5 w-3/4 rounded bg-muted' />
              <div className='mt-2 h-4 w-1/4 rounded bg-muted' />
            </div>
          ))}
        </div>
      ) : (
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
