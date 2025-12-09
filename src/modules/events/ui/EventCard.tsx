import { formatEventDateRange, getStatusLabel } from "@modules/events/lib/events-data";
import type { Event } from "@modules/events/types/event";
import { CalendarRange, Users } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@shared/ui/card";

const statusStyles = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  past: "bg-slate-50 text-slate-600 border-slate-200",
  declined: "bg-destructive/10 text-destructive border-destructive/30"
} as const;

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => (
  <Card
    className='group flex h-full flex-col overflow-hidden border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md'
    title={event.shortDescription}
  >
    <div className='relative h-48 overflow-hidden'>
      <img
        src={event.imageUrl || "/placeholder.svg"}
        alt={event.title}
        className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
      />

      <div
        className={`absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[event.status]}`}
      >
        <span className='h-2 w-2 rounded-full bg-current opacity-70' />
        {getStatusLabel(event.status)}
      </div>

      <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 text-sm text-white'>
        {formatEventDateRange(event.startDate, event.endDate)}
      </div>
    </div>

    <CardHeader className='space-y-2'>
      <CardTitle className='text-lg leading-tight'>{event.title}</CardTitle>
      <CardDescription>{event.shortDescription}</CardDescription>
    </CardHeader>

    <CardContent className='space-y-2'>
      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
        <CalendarRange className='h-4 w-4' />
        <span>{formatEventDateRange(event.startDate, event.endDate)}</span>
      </div>
      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
        <Users className='h-4 w-4' />
        <span>
          {event.participantsCount}
          {event.participantsLimit ? ` / ${event.participantsLimit}` : ""} участников
        </span>
      </div>
    </CardContent>

    <CardFooter>
      <Button className='w-full' variant='secondary' asChild>
        <Link to={`/events/${event.id}`}>Подробнее</Link>
      </Button>
    </CardFooter>
  </Card>
);
