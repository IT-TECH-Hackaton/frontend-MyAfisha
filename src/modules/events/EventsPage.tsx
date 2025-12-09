import { mapEventResponseToEvent } from "@modules/events/lib/mapEventResponse";
import { useGetEventsQuery } from "@modules/events/api/hooks/useGetEventsQuery";
import { EventCard } from "@modules/events/ui/EventCard";
import { EventsMap } from "@modules/events/ui/EventsMap";
import { CalendarDays, CalendarRange, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useMemo, useRef, useState, useEffect } from "react";

import { cn } from "@shared/lib/utils";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";

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

const buildDateStrip = (days = 24) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Array.from({ length: days }, (_, index) => {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + index);
    return nextDate;
  });
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
  const [activeTab, setActiveTab] = useState<EventTab>("my");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"startDate" | "participantsCount">("startDate");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const dateStrip = useMemo(() => buildDateStrip(), []);

  useEffect(() => {
    setPage(1);
  }, [activeTab, selectedDate, sortBy, sortOrder]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setPage(1);
    }, 500);
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const { data: eventsData, isLoading, error: eventsError } = useGetEventsQuery({
    params: {
      tab: activeTab === "my" ? "my" : activeTab === "active" ? "active" : "past",
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
    if (!eventsData?.data?.data) return [];
    return eventsData.data.data.map(mapEventResponseToEvent);
  }, [eventsData]);

  const eventsPagination = eventsData?.data?.pagination;

  const filteredEvents = events;

  const scrollStrip = (direction: "left" | "right") => {
    if (!stripRef.current) return;
    const delta = direction === "left" ? -240 : 240;
    stripRef.current.scrollBy({ left: delta, behavior: "smooth" });
  };

  const renderDateStrip = () => (
    <div className='rounded-xl border bg-card p-4 shadow-sm'>
      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-2 text-sm font-medium text-foreground'>
          <CalendarRange className='h-4 w-4' />
          Афиша событий — выберите дату
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon' onClick={() => scrollStrip("left")}>
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Button variant='ghost' size='icon' onClick={() => scrollStrip("right")}>
            <ChevronRight className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setSelectedDate(null)}
            disabled={!selectedDate}
          >
            Сбросить дату
          </Button>
        </div>
      </div>
      <div className='mt-3 flex items-center gap-3'>
        <div className='relative w-full overflow-hidden'>
          <div ref={stripRef} className='flex gap-2 overflow-x-auto pb-2 scrollbar-none'>
            {dateStrip.map((date) => {
              const active = isSameDay(date, selectedDate);
              const weekday = date
                .toLocaleDateString("ru-RU", { weekday: "short" })
                .replace(".", "")
                .toUpperCase();
              const weekend = weekday === "СБ" || weekday === "ВС";

              return (
                <button
                  key={date.toISOString()}
                  type='button'
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    "flex min-w-[64px] flex-col items-center rounded-lg border px-3 py-2 text-center text-sm transition",
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow"
                      : "bg-muted/40 hover:border-primary/40 hover:bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "text-lg font-semibold",
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
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFilters = () => (
    <div className='mb-4 flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center'>
      <div className='relative flex-1'>
        <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          type='text'
          placeholder='Поиск по названию или описанию...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='pl-9'
        />
      </div>
      <div className='flex items-center gap-2'>
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [by, order] = e.target.value.split("-") as [typeof sortBy, typeof sortOrder];
            setSortBy(by);
            setSortOrder(order);
            setPage(1);
          }}
          className='h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        >
          <option value='startDate-ASC'>Дата: сначала ранние</option>
          <option value='startDate-DESC'>Дата: сначала поздние</option>
          <option value='participantsCount-DESC'>Участников: больше</option>
          <option value='participantsCount-ASC'>Участников: меньше</option>
        </select>
      </div>
    </div>
  );

  const renderTabs = () => (
    <div className='flex flex-wrap items-center justify-between gap-3'>
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
                "rounded-lg border px-4 py-2 text-left shadow-sm transition",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-muted/40 text-foreground hover:border-primary/50 hover:bg-muted"
              )}
            >
              <div className='text-sm font-semibold'>{tab.label}</div>
              <div className='text-xs opacity-80'>{tab.subtitle}</div>
            </button>
          );
        })}
      </div>

      <div className='text-sm text-muted-foreground'>
        {eventsPagination ? (
          <>
            Показано {filteredEvents.length} из {eventsPagination.total} событи
            {eventsPagination.total === 1 ? "я" : "й"}
          </>
        ) : (
          <>
            {filteredEvents.length} событи{filteredEvents.length === 1 ? "е" : "я"}
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

        <div className='rounded-xl border bg-card p-4 shadow-sm'>
          {renderFilters()}
          {renderTabs()}

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
              <div className='rounded-xl border bg-card p-4 shadow-sm'>
                <h2 className='mb-4 text-lg font-semibold'>Карта событий</h2>
                <EventsMap events={eventsForMap} />
              </div>
            )}
          </div>
        </div>
      );
    };