import { mapEventResponseToEvent } from "@modules/events/lib/mapEventResponse";
import { useGetEventsQuery } from "@modules/events/api/hooks/useGetEventsQuery";
import { EventCard } from "@modules/events/ui/EventCard";
import { updateEventStatuses } from "@modules/events/lib/events-data";
import { Ticket, Calendar } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@shared/ui/button";
import { Card, CardContent } from "@shared/ui/card";

export const TicketsPage = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  const { data: eventsData, isLoading } = useGetEventsQuery({
    params: {
      tab: "my",
      page,
      limit
    },
    options: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  });

  const events = useMemo(() => {
    const responseData = eventsData?.data;
    if (!responseData) return [];
    
    const eventsArray = (responseData as any).data || (responseData as any).Data || [];
    if (!Array.isArray(eventsArray)) return [];
    
    const mappedEvents = eventsArray.map(mapEventResponseToEvent);
    return updateEventStatuses(mappedEvents);
  }, [eventsData]);

  const eventsPagination = (eventsData?.data as any)?.pagination || (eventsData?.data as any)?.Pagination;

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold mb-2'>Мои билеты</h1>
          <p className='text-muted-foreground'>Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-6 flex items-center gap-3'>
        <Ticket className='h-8 w-8 text-primary' />
        <div>
          <h1 className='text-3xl font-bold'>Мои билеты</h1>
          <p className='text-muted-foreground'>События, в которых вы участвуете</p>
        </div>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-16'>
            <Ticket className='h-16 w-16 text-muted-foreground mb-4' />
            <h2 className='text-xl font-semibold mb-2'>У вас пока нет билетов</h2>
            <p className='text-muted-foreground text-center mb-6 max-w-md'>
              Вы еще не подтвердили участие ни в одном событии. Найдите интересные мероприятия и присоединяйтесь!
            </p>
            <Button asChild>
              <Link to='/'>Перейти к событиям</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className='mb-4 text-sm text-muted-foreground'>
            Найдено событий: {eventsPagination?.total || events.length}
          </div>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {eventsPagination && eventsPagination.totalPages > 1 && (
            <div className='mt-8 flex items-center justify-center gap-2'>
              <Button
                variant='outline'
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1 || isLoading}
              >
                Назад
              </Button>
              <span className='text-sm text-muted-foreground'>
                Страница {eventsPagination.page} из {eventsPagination.totalPages}
              </span>
              <Button
                variant='outline'
                onClick={() => setPage((prev) => Math.min(eventsPagination.totalPages, prev + 1))}
                disabled={page === eventsPagination.totalPages || isLoading}
              >
                Вперед
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

