import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import { cn } from "@shared/lib/utils";
import { EventsTableSkeleton } from "./EventsTableSkeleton";
import type { AdminEventResponse } from "../../api/requests/getAdminEvents";

interface EventsTableProps {
  events: AdminEventResponse[];
  isLoading: boolean;
  onEditEvent: (event: AdminEventResponse) => void;
  onDeleteEvent: (eventId: string) => void;
  isDeleting: boolean;
}

export const EventsTable = ({
  events,
  isLoading,
  onEditEvent,
  onDeleteEvent,
  isDeleting
}: EventsTableProps) => {
  if (isLoading) {
    return <EventsTableSkeleton />;
  }

  if (events.length === 0) {
    return (
      <tr>
        <td colSpan={5} className='text-center p-5'>
          События не найдены
        </td>
      </tr>
    );
  }

  return (
    <>
      {events.map((event) => (
        <tr key={event.id} className='hover:bg-muted/35'>
          <td className='px-4 py-3 text-left border-b border-border'>{event.title}</td>
          <td className='px-4 py-3 text-left border-b border-border'>
            {new Date(event.startDate).toLocaleDateString("ru-RU")} —{" "}
            {new Date(event.endDate).toLocaleDateString("ru-RU")}
          </td>
          <td className='px-4 py-3 text-left border-b border-border'>{event.participantsCount} чел.</td>
          <td className='px-4 py-3 text-left border-b border-border'>
            <span
              className={cn(
                "px-2 py-1 rounded-xl text-xs font-bold",
                event.status === "Активное"
                  ? "bg-chart-2/20 text-chart-2"
                  : event.status === "Прошедшее"
                    ? "bg-muted/80 text-muted-foreground"
                    : "bg-destructive/18 text-destructive"
              )}
            >
              {event.status === "Активное"
                ? "Активно"
                : event.status === "Прошедшее"
                  ? "Прошло"
                  : "Отклонено"}
            </span>
          </td>
          <td className='px-4 py-3 text-right border-b border-border whitespace-nowrap'>
            <Button
              variant='default'
              size='sm'
              className='mr-2'
              onClick={() => onEditEvent(event)}
            >
              Редактировать
            </Button>
            <Button
              variant='destructive'
              size='sm'
              className='ml-1.25'
              onClick={() => onDeleteEvent(event.id)}
              disabled={isDeleting}
            >
              Удалить
            </Button>
          </td>
        </tr>
      ))}
    </>
  );
};