import { Star } from "lucide-react";
import { cn } from "@shared/lib/utils";

interface AverageRatingProps {
  rating: number;
  totalReviews: number;
  className?: string;
}

export const AverageRating = ({ rating, totalReviews, className }: AverageRatingProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <div className="relative h-5 w-5">
            <Star className="absolute h-5 w-5 fill-gray-300 text-gray-300" />
            <div className="absolute left-0 top-0 h-5 w-2.5 overflow-hidden">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className="h-5 w-5 fill-gray-300 text-gray-300" />
        ))}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-semibold">{rating.toFixed(1)}</span>
        <span className="text-sm text-muted-foreground">из 5</span>
        {totalReviews > 0 && (
          <span className="text-sm text-muted-foreground">
            ({totalReviews} {totalReviews === 1 ? "отзыв" : totalReviews < 5 ? "отзыва" : "отзывов"})
          </span>
        )}
      </div>
    </div>
  );
};

