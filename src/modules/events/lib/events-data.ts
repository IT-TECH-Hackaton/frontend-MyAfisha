import type { Event, EventStatus } from "@modules/events/types/event";

const statusLabel: Record<EventStatus, string> = {
  active: "Активное",
  past: "Прошедшее",
  declined: "Отклонено"
};

const deriveStatus = (event: Event, now = new Date()): EventStatus => {
  if (event.status === "declined") return "declined";

  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  if (now > end) return "past";
  if (now >= start && now <= end) return "active";

  // будущие события считаем активными для афиши
  return "active";
};

export const updateEventStatuses = (events: Event[], now = new Date()): Event[] =>
  events.map((event) => ({
    ...event,
    status: deriveStatus(event, now)
  }));

export const formatEventDateRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const sameDay = start.toDateString() === end.toDateString();

  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" };

  if (sameDay) {
    return start.toLocaleDateString("ru-RU", { ...options, weekday: "short" });
  }

  return `${start.toLocaleDateString("ru-RU", options)} — ${end.toLocaleDateString("ru-RU", options)}`;
};

export const isDateWithinEvent = (event: Event, date: Date): boolean => {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  return start <= dayEnd && end >= dayStart;
};

export const mockEvents: Event[] = [
  {
    id: "e1",
    title: "Фестиваль уличной еды",
    shortDescription: "Десятки фудтраков, музыка и мастер-классы на воздухе.",
    description:
      "Гостей ждут дегустации от шеф-поваров, детская зона, живая музыка и воркшопы по авторской кухне. Можно прийти всей семьей и провести целый день.",
    startDate: "2025-12-12T12:00:00",
    endDate: "2025-12-12T21:00:00",
    imageUrl: "/start.jpg",
    participantsCount: 120,
    participantsLimit: 200,
    status: "active",
    paymentInfo: "Вход свободный, мастер-классы от 800 ₽",
    userParticipating: false,
    location: "Парк Горького"
  },
  {
    id: "e2",
    title: "Ночной забег по Москве",
    shortDescription: "5, 10 и 21 км по освещенным набережным.",
    description:
      "Старт и финиш возле Лужников, трасса по набережным и центру. Хронометраж, медали финишеров, фото зона и горячий чай на финише.",
    startDate: "2025-12-09T20:00:00",
    endDate: "2025-12-10T00:30:00",
    imageUrl: "/mad-max.jpg",
    participantsCount: 480,
    participantsLimit: 500,
    status: "active",
    paymentInfo: "Стартовый взнос 1500 ₽",
    userParticipating: true,
    location: "Лужники"
  },
  {
    id: "e3",
    title: "Концерт симфонической музыки",
    shortDescription: "Шедевры Шостаковича и Прокофьева в исполнении камерного оркестра.",
    description:
      "В программе — лучшие произведения ХХ века. Зал с отличной акустикой, комфортные места, доступна покупка билетов онлайн.",
    startDate: "2025-12-08T19:30:00",
    endDate: "2025-12-08T21:00:00",
    imageUrl: "/parasite.webp",
    participantsCount: 350,
    participantsLimit: 350,
    status: "past",
    paymentInfo: "Билеты от 1200 ₽",
    userParticipating: true,
    location: "Зарядье"
  },
  {
    id: "e4",
    title: "Выставка цифрового искусства",
    shortDescription: "VR-инсталляции, метавселенные и лекции художников.",
    description:
      "Крупнейшая выставка цифрового искусства, где можно протестировать VR/AR проекты, пообщаться с авторами и посетить лекции о будущем медиа.",
    startDate: "2025-12-27T11:00:00",
    endDate: "2026-01-05T20:00:00",
    imageUrl: "/opengamer.jpg",
    participantsCount: 90,
    participantsLimit: 150,
    status: "active",
    paymentInfo: "Билеты от 900 ₽, есть льготы",
    userParticipating: false,
    location: "ВДНХ, павильон 57"
  },
  {
    id: "e5",
    title: "Новогодний маркет дизайнеров",
    shortDescription: "Украшения, подарки и кофе от локальных брендов.",
    description:
      "Местные бренды, уютные корнеры с едой, фотозона, упаковка подарков на месте. Отличная возможность закрыть новогодний шопинг.",
    startDate: "2025-12-22T10:00:00",
    endDate: "2025-12-22T19:00:00",
    imageUrl: "/barbie.jpg",
    participantsCount: 40,
    participantsLimit: 80,
    status: "active",
    userParticipating: false,
    location: "Хлебозавод"
  },
  {
    id: "e6",
    title: "Закрытый показ короткометражек",
    shortDescription: "Подборка фестивальных фильмов и обсуждение с режиссерами.",
    description:
      "Небольшой зал, 30 мест. После просмотра — обсуждение с авторами и голосование зрителей. Доступ только по приглашению организатора.",
    startDate: "2025-12-04T18:30:00",
    endDate: "2025-12-04T21:00:00",
    imageUrl: "/give-a-knife.webp",
    participantsCount: 30,
    participantsLimit: 30,
    status: "declined",
    userParticipating: false,
    location: "Частный кинозал"
  }
];

export const fetchEvents = async (): Promise<Event[]> => {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return updateEventStatuses(mockEvents);
};

export const getStatusLabel = (status: EventStatus) => statusLabel[status];

