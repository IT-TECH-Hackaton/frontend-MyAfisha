import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@shared/ui/button";
import { Textarea } from "@shared/ui/textarea";
import { cn } from "@shared/lib/utils";
import { useCreateReviewMutation } from "../api/hooks/useCreateReviewMutation";
import { useUpdateReviewMutation } from "../api/hooks/useUpdateReviewMutation";

interface ReviewFormProps {
  eventId: string;
  existingReview?: {
    id: string;
    rating: number;
    comment: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ReviewForm = ({ eventId, existingReview, onSuccess, onCancel }: ReviewFormProps) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || "");

  const createMutation = useCreateReviewMutation({
    options: {
      onSuccess: () => {
        setRating(0);
        setComment("");
        onSuccess?.();
      }
    }
  });

  const updateMutation = useUpdateReviewMutation({
    options: {
      onSuccess: () => {
        onSuccess?.();
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    if (existingReview) {
      updateMutation.mutate({
        params: {
          eventId,
          reviewId: existingReview.id,
          rating,
          comment
        }
      });
    } else {
      createMutation.mutate({
        params: {
          id: eventId,
          rating,
          comment
        }
      });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Оценка *</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={cn(
                  "h-8 w-8 transition-colors",
                  star <= (hoveredRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-300 text-gray-300"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="comment" className="text-sm font-medium mb-2 block">
          Комментарий
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Оставьте комментарий о событии (необязательно)"
          rows={4}
          maxLength={2000}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {comment.length} / 2000 символов
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="submit"
          disabled={isLoading || rating === 0}
        >
          {isLoading ? "Отправка..." : existingReview ? "Обновить отзыв" : "Оставить отзыв"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Отмена
          </Button>
        )}
      </div>
    </form>
  );
};

