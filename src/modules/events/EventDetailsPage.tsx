import { getStatusLabel, updateEventStatuses } from "@modules/events/lib/events-data";
import { mapEventResponseToEvent } from "@modules/events/lib/mapEventResponse";
import { useGetEventByIdQuery } from "@modules/events/api/hooks/useGetEventByIdQuery";
import { useJoinEventMutation } from "@modules/events/api/hooks/useJoinEventMutation";
import { useLeaveEventMutation } from "@modules/events/api/hooks/useLeaveEventMutation";
import { useExportParticipantsMutation } from "@modules/events/api/hooks/useExportParticipantsMutation";
import { useGetProfileQuery } from "@modules/user/api/hooks/useGetProfileQuery";
import { ArrowLeft, CalendarRange, MapPin, Users, Wallet, Download, CheckCircle2, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { AUTH_KEY } from "@shared/constants";
import { useToast } from "@shared/lib/hooks/use-toast";
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@shared/ui/dialog";

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

export const EventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const isAuth = localStorage.getItem(AUTH_KEY) === "true";
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

  const { data: profileData } = useGetProfileQuery({
    options: {
      enabled: isAuth,
      retry: false,
      refetchOnWindowFocus: false
    }
  });
  const userRole = profileData?.data?.role?.toLowerCase();
  const isAdmin = isAuth && (userRole === "admin" || userRole === "администратор");

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
        setIsLeaveDialogOpen(false);
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
    const mappedEvent = mapEventResponseToEvent(eventData.data);
    const updatedEvents = updateEventStatuses([mappedEvent]);
    return updatedEvents[0] || null;
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
        <div className='md:col-span-2 space-y-6'>
          <div className='overflow-hidden rounded-xl border'>
            <img
              src={event.imageUrl || "/placeholder.svg"}
              alt={event.title}
              className='h-80 w-full object-cover'
            />
          </div>
          <div className='rounded-xl border bg-card p-6'>
            <h2 className='mb-3 text-xl font-semibold'>Описание</h2>
            <p className='text-base leading-relaxed text-foreground'>{event.description}</p>
          </div>
        </div>
        <Card className='h-full'>
          <CardHeader>
            <CardTitle className='text-2xl'>{event.title}</CardTitle>
            <p className='text-sm text-muted-foreground'>{event.shortDescription}</p>
          </CardHeader>
          <CardContent className='space-y-4 text-sm text-muted-foreground'>
            <div className='space-y-2'>
              <div className='flex items-start gap-2'>
                <CalendarRange className='mt-0.5 h-4 w-4 text-foreground' />
                <div className='flex-1'>
                  <p className='font-medium text-foreground mb-1'>Дата начала</p>
                  <p>{formatDate(event.startDate)}</p>
                </div>
              </div>
              <div className='flex items-start gap-2'>
                <CalendarRange className='mt-0.5 h-4 w-4 text-foreground' />
                <div className='flex-1'>
                  <p className='font-medium text-foreground mb-1'>Дата окончания</p>
                  <p>{formatDate(event.endDate)}</p>
                </div>
              </div>
            </div>
            <div className='flex items-start gap-2'>
              <Users className='mt-0.5 h-4 w-4 text-foreground' />
              <div className='flex-1'>
                <p className='font-medium text-foreground mb-1'>Участники</p>
                <p>
                  {event.participantsCount}
                  {event.participantsLimit ? ` / ${event.participantsLimit}` : ""} человек
                </p>
              </div>
            </div>
            {isAuth && (
              <div className='flex items-center gap-2 pt-2 border-t'>
                {event.userParticipating ? (
                  <div className='flex items-center gap-2 text-emerald-600'>
                    <CheckCircle2 className='h-4 w-4' />
                    <span className='font-medium text-sm'>Вы участвуете</span>
                  </div>
                ) : (
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <XCircle className='h-4 w-4' />
                    <span className='font-medium text-sm'>Вы не участвуете</span>
                  </div>
                )}
              </div>
            )}
            {event.paymentInfo && (
              <div className='flex items-start gap-2'>
                <Wallet className='mt-0.5 h-4 w-4 text-foreground' />
                <div className='flex-1'>
                  <p className='font-medium text-foreground mb-1'>Оплата</p>
                  <p>{event.paymentInfo}</p>
                </div>
              </div>
            )}
            {event.location && (
              <div className='flex items-start gap-2'>
                <MapPin className='mt-0.5 h-4 w-4 text-foreground' />
                <div className='flex-1'>
                  <p className='font-medium text-foreground mb-1'>Место</p>
                  <a
                    href={
                      event.coordinates
                        ? `https://yandex.ru/maps/?pt=${event.coordinates.lon},${event.coordinates.lat}&z=15`
                        : `https://yandex.ru/maps/?text=${encodeURIComponent(event.location)}`
                    }
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary hover:underline cursor-pointer'
                  >
                    {event.location}
                  </a>
                </div>
              </div>
            )}
            <div className='pt-2 border-t'>
              <div className='flex items-center gap-2'>
                <span className='text-xs text-muted-foreground/70'>Статус события:</span>
                <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${
                  event.status === "active" 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : event.status === "past"
                    ? "bg-slate-50 text-slate-600 border-slate-200"
                    : "bg-destructive/10 text-destructive border-destructive/30"
                }`}>
                  {getStatusLabel(event.status)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='mt-6 flex flex-wrap gap-3'>
        {isAuth && event.status === "active" && (
          <>
            {event.userParticipating ? (
              <Button
                variant='destructive'
                onClick={() => setIsLeaveDialogOpen(true)}
                disabled={leaveMutation.isPending}
              >
                Отменить участие
              </Button>
            ) : (
              <Button
                onClick={() => {
                  if (event.participantsLimit && event.participantsCount >= event.participantsLimit) {
                    toast({
                      className: "bg-red-800 text-white hover:bg-red-700",
                      title: "Достигнут максимальный лимит участников",
                      description: "Свободных мест больше нет"
                    });
                    return;
                  }
                  joinMutation.mutate({ params: { id: event.id } });
                }}
                disabled={joinMutation.isPending || (event.participantsLimit ? event.participantsCount >= event.participantsLimit : false)}
              >
                Подтвердить участие
              </Button>
            )}
          </>
        )}
        {isAuth && event.status === "past" && (
          <div className='text-sm text-muted-foreground'>
            {event.userParticipating ? (
              <div className='flex items-center gap-2'>
                <CheckCircle2 className='h-4 w-4 text-emerald-600' />
                <span>Вы участвовали в этом событии</span>
              </div>
            ) : (
              <div className='flex items-center gap-2'>
                <XCircle className='h-4 w-4' />
                <span>Событие завершено</span>
              </div>
            )}
          </div>
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

      <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отменить участие?</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите отменить участие в событии "{event.title}"? 
              Это действие можно будет отменить позже.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsLeaveDialogOpen(false)}
              disabled={leaveMutation.isPending}
            >
              Отмена
            </Button>
            <Button
              variant='destructive'
              onClick={() => {
                leaveMutation.mutate({ params: { id: event.id } });
              }}
              disabled={leaveMutation.isPending}
            >
              {leaveMutation.isPending ? "Отмена..." : "Отменить участие"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};