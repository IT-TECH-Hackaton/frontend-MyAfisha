import { getStatusLabel } from "@modules/events/lib/events-data";
import type { Event } from "@modules/events/types/event";
import { CalendarRange, Users, MapPin, Wallet } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@shared/ui/card";
import { Tooltip } from "@shared/ui/tooltip";

const statusStyles = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  past: "bg-slate-50 text-slate-600 border-slate-200",
  declined: "bg-destructive/10 text-destructive border-destructive/30"
} as const;

interface EventCardProps {
  event: Event;
}

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

export const EventCard = ({ event }: EventCardProps) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/events/${event.id}`);
  };

  const tooltipContent = (
    <div className='space-y-2'>
      <div className='font-semibold text-base'>{event.title}</div>
      {event.shortDescription && (
        <div className='text-sm text-muted-foreground'>{event.shortDescription}</div>
      )}
      <div className='space-y-1 text-xs'>
        <div className='flex items-center gap-2'>
          <CalendarRange className='h-3 w-3' />
          <span>
            <strong>Начало:</strong> {formatDate(event.startDate)}
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <CalendarRange className='h-3 w-3' />
          <span>
            <strong>Окончание:</strong> {formatDate(event.endDate)}
          </span>
        </div>
        {event.location && (
          <div className='flex items-center gap-2'>
            <MapPin className='h-3 w-3' />
            <span>{event.location}</span>
          </div>
        )}
        {event.paymentInfo && (
          <div className='flex items-center gap-2'>
            <Wallet className='h-3 w-3' />
            <span>{event.paymentInfo}</span>
          </div>
        )}
        <div className='pt-1 border-t'>
          <span className='text-xs opacity-80'>{event.description}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Tooltip content={tooltipContent}>
      <div onClick={handleCardClick} className='block h-full cursor-pointer'>
        <Card className='group flex h-full flex-col overflow-hidden bg-card transition hover:-translate-y-1 hover:shadow-lg'>
          <div className='relative h-48 overflow-hidden'>
            {!imageLoaded || imageError ? (
              <div className='absolute inset-0 animate-pulse bg-muted' />
            ) : null}
            {!imageError && (
              <img
                src={event.imageUrl || "/placeholder.svg"}
                alt=''
                className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            )}

            <div
              className={`absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[event.status]}`}
            >
              <span className='h-2 w-2 rounded-full bg-current opacity-70' />
              {getStatusLabel(event.status)}
            </div>
          </div>

          <CardHeader className='space-y-2'>
            <CardTitle className='text-lg leading-tight'>{event.title}</CardTitle>
          </CardHeader>

          <CardContent className='space-y-3'>
            <div className='space-y-2 text-sm'>
              <div className='flex items-center gap-2 text-muted-foreground'>
                <CalendarRange className='h-4 w-4 flex-shrink-0' />
                <div className='flex flex-col'>
                  <span className='text-xs text-muted-foreground/70'>Начало</span>
                  <span>{formatDate(event.startDate)}</span>
                </div>
              </div>
              <div className='flex items-center gap-2 text-muted-foreground'>
                <CalendarRange className='h-4 w-4 flex-shrink-0' />
                <div className='flex flex-col'>
                  <span className='text-xs text-muted-foreground/70'>Окончание</span>
                  <span>{formatDate(event.endDate)}</span>
                </div>
              </div>
            </div>
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <Users className='h-4 w-4 flex-shrink-0' />
              <span>
                {event.participantsCount}
                {event.participantsLimit ? ` / ${event.participantsLimit}` : ""} участников
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </Tooltip>
  );
};
