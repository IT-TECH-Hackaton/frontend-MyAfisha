import { formatEventDateRange, getStatusLabel } from "@modules/events/lib/events-data";
import { mapEventResponseToEvent } from "@modules/events/lib/mapEventResponse";
import { useGetEventByIdQuery } from "@modules/events/api/hooks/useGetEventByIdQuery";
import { useJoinEventMutation } from "@modules/events/api/hooks/useJoinEventMutation";
import { useLeaveEventMutation } from "@modules/events/api/hooks/useLeaveEventMutation";
import { useExportParticipantsMutation } from "@modules/events/api/hooks/useExportParticipantsMutation";
import { useGetProfileQuery } from "@modules/user/api/hooks/useGetProfileQuery";
import { ArrowLeft, CalendarRange, MapPin, Users, Wallet, Download } from "lucide-react";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { useToast } from "@shared/lib/hooks/use-toast";
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";

export const EventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const { data: profileData } = useGetProfileQuery({});
  const userRole = profileData?.data?.role?.toLowerCase();
  const isAdmin = userRole === "admin" || userRole === "администратор";

  const { data: eventData, isLoading: loading, refetch } = useGetEventByIdQuery({
    params: { id: id || "" },
    options: {
      enabled: !!id
    }
  });

  const joinMutation = useJoinEventMutation({
    options: {
      onSuccess: () => {
        toast({
          title: "Участие подтверждено",
          description: "Вы добавлены в список участников"
        });
        refetch();
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || "Не удалось подтвердить участие";
        toast({
          className: "bg-red-800 text-white hover:bg-red-700",
          title: "Ошибка",
          description: errorMessage
        });
      }
    }
  });

  const leaveMutation = useLeaveEventMutation({
    options: {
      onSuccess: () => {
        toast({
          title: "Участие отменено",
          description: "Мы убрали событие из раздела «Мои события»"
        });
        refetch();
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || "Не удалось отменить участие";
        toast({
          className: "bg-red-800 text-white hover:bg-red-700",
          title: "Ошибка",
          description: errorMessage
        });
      }
    }
  });

  const exportMutation = useExportParticipantsMutation({
    options: {
      onSuccess: async (response) => {
        try {
          const blob = response.data;
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          const fileName = `participants_${event?.title?.replace(/[^a-zA-Z0-9]/g, "_") || id}_${new Date().toISOString().split("T")[0]}.csv`;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
          toast({
            title: "Экспорт выполнен",
            description: "Список участников успешно скачан"
          });
        } catch (error) {
          toast({
            className: "bg-red-800 text-white hover:bg-red-700",
            title: "Ошибка",
            description: "Не удалось скачать файл"
          });
        }
      },
      onError: async (error: any) => {
        let errorMessage = "Не удалось экспортировать участников";
        if (error?.response?.data) {
          try {
            const text = await error.response.data.text();
            const json = JSON.parse(text);
            errorMessage = json.message || errorMessage;
          } catch {
            errorMessage = error?.response?.data?.message || errorMessage;
          }
        }
        toast({
          className: "bg-red-800 text-white hover:bg-red-700",
          title: "Ошибка",
          description: errorMessage
        });
      }
    }
  });

  const event = useMemo(() => {
    if (!eventData?.data) return null;
    return mapEventResponseToEvent(eventData.data);
  }, [eventData]);

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='h-6 w-32 animate-pulse rounded bg-muted' />
        <div className='mt-6 grid gap-6 md:grid-cols-3'>
          <div className='aspect-video w-full animate-pulse rounded-xl bg-muted md:col-span-2' />
          <div className='h-40 animate-pulse rounded-xl bg-muted' />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <Link
          to='/'
          className='inline-flex items-center gap-2 text-sm text-primary hover:underline'
        >
          <ArrowLeft className='h-4 w-4' />
          Вернуться к афише
        </Link>
        <div className='mt-6 rounded-xl border bg-muted/40 p-6 text-muted-foreground'>
          Событие не найдено или удалено.
        </div>
      </div>
    );
  }

  const copyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Ссылка скопирована", description: "Теперь ее можно отправить друзьям" });
    } catch {
      toast({
        title: "Не удалось скопировать",
        description: "Скопируйте ссылку вручную из адресной строки"
      });
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-6 flex items-center justify-between gap-4'>
        <Link
          to='/'
          className='inline-flex items-center gap-2 text-sm text-primary hover:underline'
        >
          <ArrowLeft className='h-4 w-4' />К афише
        </Link>
        <div className='text-xs font-semibold uppercase text-muted-foreground'>
          {getStatusLabel(event.status)}
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-3'>
        <div className='md:col-span-2'>
          <div className='overflow-hidden rounded-xl border'>
            <img
              src={event.imageUrl || "/placeholder.svg"}
              alt={event.title}
              className='h-80 w-full object-cover'
            />
          </div>
        </div>
        <Card className='h-full'>
          <CardHeader>
            <CardTitle className='text-2xl'>{event.title}</CardTitle>
            <p className='text-sm text-muted-foreground'>{event.shortDescription}</p>
          </CardHeader>
          <CardContent className='space-y-3 text-sm text-muted-foreground'>
            <div className='flex items-start gap-2'>
              <CalendarRange className='mt-0.5 h-4 w-4 text-foreground' />
              <div>
                <p className='font-medium text-foreground'>Даты</p>
                <p>{formatEventDateRange(event.startDate, event.endDate)}</p>
              </div>
            </div>
            <div className='flex items-start gap-2'>
              <Users className='mt-0.5 h-4 w-4 text-foreground' />
              <div>
                <p className='font-medium text-foreground'>Участники</p>
                <p>
                  {event.participantsCount}
                  {event.participantsLimit ? ` / ${event.participantsLimit}` : ""} человек
                </p>
              </div>
            </div>
            {event.paymentInfo && (
              <div className='flex items-start gap-2'>
                <Wallet className='mt-0.5 h-4 w-4 text-foreground' />
                <div>
                  <p className='font-medium text-foreground'>Оплата</p>
                  <p>{event.paymentInfo}</p>
                </div>
              </div>
            )}
            {event.location && (
              <div className='flex items-start gap-2'>
                <MapPin className='mt-0.5 h-4 w-4 text-foreground' />
                <div>
                  <p className='font-medium text-foreground'>Место</p>
                  <p>{event.location}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className='mt-6 rounded-xl border bg-card p-6'>
        <h2 className='mb-3 text-xl font-semibold'>Описание</h2>
        <p className='text-base leading-relaxed text-foreground'>{event.description}</p>
      </div>

      <div className='mt-6 flex flex-wrap gap-3'>
        {event.status === "active" && (
          <>
            {event.userParticipating ? (
              <Button
                variant='destructive'
                onClick={() => {
                  if (window.confirm("Вы уверены, что хотите отменить участие?")) {
                    leaveMutation.mutate({ params: { id: event.id } });
                  }
                }}
                disabled={leaveMutation.isPending}
              >
                Отменить участие
              </Button>
            ) : (
              <Button
                onClick={() => {
                  if (event.participantsLimit && event.participantsCount >= event.participantsLimit) {
                    toast({
                      title: "Достигнут максимальный лимит участников",
                      description: "Свободных мест больше нет"
                    });
                    return;
                  }
                  joinMutation.mutate({ params: { id: event.id } });
                }}
                disabled={joinMutation.isPending}
              >
                Подтвердить участие
              </Button>
            )}
          </>
        )}
        {isAdmin && (
          <Button
            onClick={() => {
              exportMutation.mutate({ params: { id: event.id, format: "csv" } });
            }}
            variant='outline'
            disabled={exportMutation.isPending}
          >
            <Download className='mr-2 h-4 w-4' />
            {exportMutation.isPending ? "Экспорт..." : "Экспорт участников (CSV)"}
          </Button>
        )}
        <Button onClick={copyLink} variant='outline'>
          Скопировать ссылку
        </Button>
        <Button variant='outline' asChild>
          <Link to='/'>Вернуться к афише</Link>
        </Button>
      </div>
    </div>
  );
};