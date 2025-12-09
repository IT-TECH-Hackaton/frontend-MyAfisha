import { mapEventResponseToEvent } from "@modules/events/lib/mapEventResponse";
import { useGetEventsQuery } from "@modules/events/api/hooks/useGetEventsQuery";
import { EventCard } from "@modules/events/ui/EventCard";
import { EventsMap } from "@modules/events/ui/EventsMap";
import { updateEventStatuses } from "@modules/events/lib/events-data";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { AUTH_KEY } from "@shared/constants";
import { cn } from "@shared/lib/utils";
import { Button } from "@shared/ui/button";

type EventTab = "my" | "active" | "past";

const tabConfig: Record<EventTab, { label: string; subtitle: string }> = {
  my: { label: "Мои события", subtitle: "Подтверждено участие" },
  active: { label: "Активные события", subtitle: "Все доступные события" },
  past: { label: "Прошедшие события", subtitle: "Завершенные мероприятия" }
};

const emptyMessages: Record<EventTab, string> = {
  my: "Нет событий",
  active: "Нет активных событий",
  past: "Нет прошедших событий"
};

const buildDateStrip = (startDate: Date, days: number) => {
  return Array.from({ length: days }, (_, index) => {
    const nextDate = new Date(startDate);
    nextDate.setDate(startDate.getDate() + index);
    return nextDate;
  });
};

const getMonthNameShort = (date: Date) => {
  return date.toLocaleDateString("ru-RU", { month: "long" }).toUpperCase();
};

const isSameDay = (left: Date | null, right: Date | null) => {
  if (!left || !right) return false;
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
};

export const EventsPage = () => {
  const [searchParams] = useSearchParams();
  const isAuth = localStorage.getItem(AUTH_KEY) === "true";
  const [activeTab, setActiveTab] = useState<EventTab>(isAuth ? "my" : "active");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const searchQuery = searchParams.get("search") || "";
  const [sortBy, setSortBy] = useState<"startDate" | "participantsCount">("startDate");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [dateStrip, setDateStrip] = useState<Date[]>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return buildDateStrip(today, 60);
  });

  useEffect(() => {
    setPage(1);
  }, [activeTab, selectedDate, sortBy, sortOrder, searchQuery]);

  const { data: eventsData, isLoading, error: eventsError } = useGetEventsQuery({
    params: {
      tab: activeTab === "my" ? "my" : activeTab === "active" ? "active" : activeTab === "past" ? "past" : "active",
      dateFrom: selectedDate ? selectedDate.toISOString().split("T")[0] : undefined,
      dateTo: selectedDate ? selectedDate.toISOString().split("T")[0] : undefined,
      search: searchQuery || undefined,
      sortBy,
      sortOrder,
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

  const filteredEvents = events;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const lastDate = dateStrip[dateStrip.length - 1];
          const newDates = buildDateStrip(new Date(lastDate.getTime() + 24 * 60 * 60 * 1000), 30);
          setDateStrip((prev) => [...prev, ...newDates]);
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [dateStrip]);

  const scrollStrip = (direction: "left" | "right") => {
    if (!stripRef.current) return;
    const delta = direction === "left" ? -240 : 240;
    stripRef.current.scrollBy({ left: delta, behavior: "smooth" });
  };

  const renderDateStrip = () => {
    return (
      <div>
        <div className='mb-2 flex items-center justify-end'>
          <div className='flex items-center gap-2'>
            <Button variant='ghost' size='icon' onClick={() => scrollStrip("left")}>
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <Button variant='ghost' size='icon' onClick={() => scrollStrip("right")}>
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
        <div className='relative w-full overflow-hidden'>
          <div ref={stripRef} className='flex gap-2 overflow-hidden pb-2'>
            {dateStrip.map((date, index) => {
              const active = isSameDay(date, selectedDate);
              const weekday = date
                .toLocaleDateString("ru-RU", { weekday: "short" })
                .replace(".", "")
                .toUpperCase();
              const weekend = weekday === "СБ" || weekday === "ВС";
              const isFirstOfMonth = date.getDate() === 1;
              const prevDate = index > 0 ? dateStrip[index - 1] : null;
              const showMonthLabel = isFirstOfMonth && prevDate && prevDate.getMonth() !== date.getMonth();

              return (
                <div key={date.toISOString()} className='flex items-center gap-2'>
                  {showMonthLabel && (
                    <div className='text-xs font-medium text-muted-foreground whitespace-nowrap'>
                      {getMonthNameShort(date)} {date.getFullYear()}
                    </div>
                  )}
                  <button
                    type='button'
                    onClick={() => setSelectedDate(date)}
                    className={cn(
                      "flex min-w-[64px] flex-col items-center rounded-lg px-3 py-2 text-center text-sm transition",
                      active
                        ? "bg-primary text-primary-foreground shadow"
                        : "bg-muted/40 hover:bg-muted"
                    )}
                  >
                    <span
                      className={cn(
                        "text-3xl font-semibold",
                        weekend && !active && "text-destructive"
                      )}
                    >
                      {date.getDate()}
                    </span>
                    <span
                      className={cn(
                        "text-[11px] uppercase tracking-tight",
                        weekend && !active && "text-destructive"
                      )}
                    >
                      {weekday}
                    </span>
                  </button>
                </div>
              );
            })}
            <div ref={observerRef} className='min-w-[1px]' />
          </div>
        </div>
      </div>
    );
  };

  const renderFilters = () => (
    <div className='mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex flex-wrap items-center gap-3'>
        <div className='flex items-center gap-2'>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split("-") as [typeof sortBy, typeof sortOrder];
              setSortBy(by);
              setSortOrder(order);
              setPage(1);
            }}
            className='h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          >
            <option value='startDate-ASC'>Дата: сначала ранние</option>
            <option value='startDate-DESC'>Дата: сначала поздние</option>
            <option value='participantsCount-DESC'>Участников: больше</option>
            <option value='participantsCount-ASC'>Участников: меньше</option>
          </select>
        </div>
        <div className='flex flex-wrap gap-2'>
          {(Object.keys(tabConfig) as EventTab[]).map((tabKey) => {
            const tab = tabConfig[tabKey];
            const isActive = tabKey === activeTab;
            return (
              <button
                key={tabKey}
                type='button'
                onClick={() => {
                  setActiveTab(tabKey);
                  setPage(1);
                }}
                className={cn(
                  "rounded-lg border px-4 py-2 text-base font-medium transition",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-muted/40 text-foreground hover:border-primary/50 hover:bg-muted"
                )}
              >
                {tabKey === "my" ? "Мои" : tabKey === "active" ? "Активные" : "Прошедшие"}
              </button>
            );
          })}
        </div>
      </div>

      <div className='text-base text-muted-foreground'>
        {eventsPagination && (
          <>
            {eventsPagination.total} событи
            {eventsPagination.total === 1 ? "е" : "й"}
          </>
        )}
      </div>
    </div>
  );

  const renderSkeleton = () => (
    <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className='animate-pulse space-y-3 rounded-xl border bg-muted/30 p-3'>
          <div className='h-40 rounded-lg bg-muted' />
          <div className='h-4 w-3/4 rounded bg-muted' />
          <div className='h-3 w-1/3 rounded bg-muted' />
          <div className='h-9 rounded bg-muted' />
        </div>
      ))}
    </div>
  );

  const renderEmpty = () => (
    <div className='flex flex-col items-center gap-3 rounded-xl border bg-muted/40 p-10 text-center text-muted-foreground'>
      <CalendarDays className='h-8 w-8' />
      <div className='text-lg font-semibold text-foreground'>{emptyMessages[activeTab]}</div>
      <div className='text-sm'>
        Попробуйте выбрать другой день или переключить вкладку — события появятся автоматически.
      </div>
    </div>
  );

  const eventsForMap = useMemo(() => {
    return events.filter((event) => event.status !== "declined" && event.coordinates);
  }, [events]);

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex flex-col gap-6'>
        <div>
          <p className='text-sm text-muted-foreground'>Афиша событий</p>
          <h1 className='text-3xl font-bold'>События</h1>
        </div>

        {renderDateStrip()}

        <div>
          {renderFilters()}

          <div className='mt-6'>
            {isLoading ? (
              renderSkeleton()
            ) : eventsError ? (
              <div className='flex flex-col items-center gap-3 rounded-xl border border-destructive/50 bg-destructive/10 p-10 text-center'>
                <div className='text-lg font-semibold text-destructive'>Ошибка загрузки событий</div>
                <div className='text-sm text-muted-foreground'>
                  {eventsError instanceof Error
                    ? eventsError.message
                    : "Не удалось загрузить события. Пожалуйста, попробуйте позже."}
                </div>
                <Button
                  variant='outline'
                  onClick={() => window.location.reload()}
                  className='mt-2'
                >
                  Обновить страницу
                </Button>
              </div>
            ) : filteredEvents.length ? (
              <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              renderEmpty()
            )}
          </div>
        </div>

        {eventsPagination && eventsPagination.totalPages > 1 && (
          <div className='mt-6 flex items-center justify-center gap-4'>
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

            {eventsForMap.length > 0 && (
              <div className='p-4'>
                <h2 className='mb-4 text-lg font-semibold'>Карта событий</h2>
                <EventsMap events={eventsForMap} />
              </div>
            )}
      </div>
    </div>
  );
};