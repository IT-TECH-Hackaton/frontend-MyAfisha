import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@shared/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { ReviewForm } from "./ReviewForm";
import { useGetReviewsQuery } from "../api/hooks/useGetReviewsQuery";
import { useGetProfileQuery } from "@modules/user/api/hooks/useGetProfileQuery";

interface ReviewModalProps {
  eventId: string;
  eventTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const ReviewModal = ({ eventId, eventTitle, open, onOpenChange, onSuccess }: ReviewModalProps) => {
  const queryClient = useQueryClient();
  const { data: profileData } = useGetProfileQuery({
    options: {
      retry: false,
      refetchOnWindowFocus: false
    }
  });
  const currentUserId = profileData?.data?.uid;

  const { data: reviewsData } = useGetReviewsQuery({
    params: { id: eventId, page: 1, limit: 100 },
    options: {
      enabled: open,
      refetchOnWindowFocus: false
    }
  });

  const hasUserReview = reviewsData?.data?.data?.some(
    (review) => review.userID === currentUserId
  ) || false;

  const existingReview = reviewsData?.data?.data?.find(
    (review) => review.userID === currentUserId
  );

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["getEvents"] });
    queryClient.invalidateQueries({ queryKey: ["getReviews", eventId] });
    onOpenChange(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {hasUserReview ? "Редактировать отзыв" : "Оставить отзыв"}
          </DialogTitle>
          <DialogDescription>
            {hasUserReview 
              ? `Обновите ваш отзыв о событии "${eventTitle}"`
              : `Поделитесь вашим мнением о событии "${eventTitle}"`}
          </DialogDescription>
        </DialogHeader>
        <ReviewForm
          eventId={eventId}
          existingReview={existingReview ? {
            id: existingReview.id,
            rating: existingReview.rating,
            comment: existingReview.comment
          } : undefined}
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

