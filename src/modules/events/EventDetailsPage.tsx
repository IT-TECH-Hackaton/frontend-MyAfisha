import {
  fetchEventById,
  formatEventDateRange,
  getStatusLabel
} from "@modules/events/lib/events-data";
import type { Event } from "@modules/events/types/event";
import { ArrowLeft, CalendarRange, MapPin, Users, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useToast } from "@shared/lib/hooks/use-toast";
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";

export const EventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchEventById(id)
      .then((res) => setEvent(res))
      .finally(() => setLoading(false));
  }, [id]);

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
        <Button onClick={copyLink}>Скопировать ссылку</Button>
        <Button variant='outline' asChild>
          <Link to='/'>Вернуться к афише</Link>
        </Button>
      </div>
    </div>
  );
};
