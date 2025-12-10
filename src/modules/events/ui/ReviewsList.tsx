import { useState } from "react";
import { Star, Edit2, Trash2 } from "lucide-react";
import { Button } from "@shared/ui/button";
import { Card, CardContent } from "@shared/ui/card";
import { cn } from "@shared/lib/utils";
import { useToast } from "@shared/lib/hooks/use-toast";
import { useGetReviewsQuery } from "../api/hooks/useGetReviewsQuery";
import { useDeleteReviewMutation } from "../api/hooks/useDeleteReviewMutation";
import { useGetProfileQuery } from "@modules/user/api/hooks/useGetProfileQuery";
import { ReviewForm } from "./ReviewForm";

interface ReviewsListProps {
  eventId: string;
  onReviewUpdate?: () => void;
}

export const ReviewsList = ({ eventId, onReviewUpdate }: ReviewsListProps) => {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  const { data: profileData } = useGetProfileQuery({
    options: {
      retry: false,
      refetchOnWindowFocus: false
    }
  });
  const currentUserId = profileData?.data?.uid;

  const { data: reviewsData, isLoading, refetch } = useGetReviewsQuery({
    params: { id: eventId, page, limit },
    options: {
      refetchOnWindowFocus: false
    }
  });

  const deleteMutation = useDeleteReviewMutation({
    options: {
      onSuccess: () => {
        toast({
          title: "Отзыв удален",
          description: "Ваш отзыв успешно удален"
        });
        refetch();
        onReviewUpdate?.();
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.error || error?.message || "Не удалось удалить отзыв";
        toast({
          className: "bg-red-800 text-white hover:bg-red-700",
          title: "Ошибка",
          description: errorMessage
        });
      }
    }
  });

  const reviews = reviewsData?.data?.data || [];
  const pagination = reviewsData?.data?.pagination;

  const handleDelete = (reviewId: string) => {
    if (confirm("Вы уверены, что хотите удалить этот отзыв?")) {
      deleteMutation.mutate({
        params: {
          eventId,
          reviewId
        }
      });
    }
  };

  const handleEditSuccess = () => {
    setEditingReviewId(null);
    refetch();
    onReviewUpdate?.();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 w-32 bg-muted rounded mb-2" />
              <div className="h-4 w-full bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Пока нет отзывов. Будьте первым!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const isOwnReview = review.userID === currentUserId;
        const isEditing = editingReviewId === review.id;

        if (isEditing) {
          return (
            <Card key={review.id}>
              <CardContent className="p-4">
                <ReviewForm
                  eventId={eventId}
                  existingReview={{
                    id: review.id,
                    rating: review.rating,
                    comment: review.comment
                  }}
                  onSuccess={handleEditSuccess}
                  onCancel={() => setEditingReviewId(null)}
                />
              </CardContent>
            </Card>
          );
        }

        return (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{review.user.fullName}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "h-4 w-4",
                            star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-300 text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-foreground mb-2 whitespace-pre-wrap">
                      {review.comment}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString("ru-RU", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                    {review.updatedAt && review.updatedAt !== review.createdAt && (
                      <span className="ml-2">(изменено)</span>
                    )}
                  </p>
                </div>
                {isOwnReview && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingReviewId(review.id)}
                      className="h-8 w-8"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(review.id)}
                      disabled={deleteMutation.isPending}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => {
              const newPage = Math.max(1, p - 1);
              return newPage;
            })}
            disabled={page === 1}
          >
            Назад
          </Button>
          <span className="text-sm text-muted-foreground">
            Страница {page} из {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => {
              const newPage = Math.min(pagination.totalPages, p + 1);
              return newPage;
            })}
            disabled={page === pagination.totalPages}
          >
            Вперед
          </Button>
        </div>
      )}
    </div>
  );
};

