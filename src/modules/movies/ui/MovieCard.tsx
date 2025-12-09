import type { Movie } from "@modules/movies/types/moive";
import { Star } from "lucide-react";

import { Button } from "@shared/ui/button";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const fullStars = Math.floor(movie.rating);
  const hasHalfStar = movie.rating % 1 >= 0.5;

  return (
    <div className='flex flex-col'>
      <div className='relative mb-3 overflow-hidden rounded-xl'>
        <img
          src={movie.posterUrl || "/placeholder.svg"}
          alt={movie.title}
          className='aspect-[3/4] w-full object-cover'
        />
        <div className='absolute bottom-3 right-3 rounded-md bg-violet-600 px-2 py-1 text-xs text-white'>
          <div className='font-medium'>{movie.genre}</div>
          <div className='text-violet-200'>
            {movie.country}, {movie.year}
          </div>
        </div>
      </div>

      <h3 className='mb-1 text-lg font-semibold text-foreground'>
        {movie.title} ({movie.ageRating})
      </h3>

      <p className='mb-2 text-sm text-muted-foreground'>{movie.type}</p>

      <div className='mb-1 flex items-center gap-0.5'>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < fullStars
                ? "fill-amber-400 text-amber-400"
                : i === fullStars && hasHalfStar
                  ? "fill-amber-400/50 text-amber-400"
                  : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
      <p className='mb-4 text-sm text-muted-foreground'>Kinopoisk - {movie.kinopoiskRating}</p>

      <Button className='w-full bg-violet-600 hover:bg-violet-700 text-white'>Подробнее</Button>
    </div>
  );
}
