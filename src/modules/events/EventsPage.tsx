import {
  fetchEvents,
  isDateWithinEvent,
  updateEventStatuses
} from "@modules/events/lib/events-data";
import type { Event } from "@modules/events/types/event";
import { EventCard } from "@modules/events/ui/EventCard";
import { EventsMap } from "@modules/events/ui/EventsMap";
import { CalendarDays, CalendarRange, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useToast } from "@shared/lib/hooks/use-toast";
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
  const { toast } = useToast();

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<EventTab>("my");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);

  const dateStrip = useMemo(() => buildDateStrip(), []);

  const applyStatusRefresh = useCallback(
    () =>
      setEvents((prev) => {
        if (!prev.length) return prev;
        return updateEventStatuses(prev);
      }),
    []
  );

  useEffect(() => {
    setIsLoading(true);
    fetchEvents()
      .then((data) => setEvents(updateEventStatuses(data)))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const timer = setInterval(applyStatusRefresh, 60 * 1000);
    return () => clearInterval(timer);
  }, [applyStatusRefresh]);

  const filteredEvents = useMemo(() => {
    const base = events
      .filter((event) => event.status !== "declined")
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    const byTab = base.filter((event) => {
      if (activeTab === "active") return event.status === "active";
      if (activeTab === "past") return event.status === "past";
      return event.userParticipating && (event.status === "active" || event.status === "past");
    });

    if (!selectedDate) return byTab;
    return byTab.filter((event) => isDateWithinEvent(event, selectedDate));
  }, [events, activeTab, selectedDate]);

  const handleConfirmParticipation = (eventId: string) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id !== eventId) return event;
        if (event.participantsLimit && event.participantsCount >= event.participantsLimit) {
          toast({
            title: "Достигнут максимальный лимит участников",
            description: "Свободных мест больше нет"
          });
          return event;
        }
        return {
          ...event,
          participantsCount: event.participantsCount + 1,
          userParticipating: true
        };
      })
    );

    toast({
      title: "Участие подтверждено",
      description: "Вы добавлены в список участников"
    });
  };

  const confirmCancelParticipation = () => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === ""
          ? {
              ...event,
              participantsCount: Math.max(0, event.participantsCount - 1),
              userParticipating: false
            }
          : event
      )
    );

    toast({
      title: "Участие отменено",
      description: "Мы убрали событие из раздела «Мои события»"
    });
  };

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
              onClick={() => setActiveTab(tabKey)}
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
        {filteredEvents.length} событи{filteredEvents.length === 1 ? "е" : "я"}
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
          {renderTabs()}

          <div className='mt-6'>
            {isLoading ? (
              renderSkeleton()
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