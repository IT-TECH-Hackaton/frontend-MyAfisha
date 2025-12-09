import type { Event, EventStatus } from "@modules/events/types/event";

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

export const statusLabel: Record<EventStatus, string> = {
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

  return "active";
};

export const updateEventStatuses = (events: Event[], now = new Date()): Event[] =>
  events.map((event) => ({
    ...event,
    status: deriveStatus(event, now)
  }));

export const getStatusLabel = (status: EventStatus) => statusLabel[status];

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
    location: "Парк Горького, Таганрог",
    coordinates: { lat: 47.245, lon: 38.905 }
  },
  {
    id: "e2",
    title: "Ночной забег по Таганрогу",
    shortDescription: "5, 10 и 21 км по освещенным набережным.",
    description:
      "Старт и финиш возле набережной, трасса по набережным и центру. Хронометраж, медали финишеров, фото зона и горячий чай на финише.",
    startDate: "2025-12-09T20:00:00",
    endDate: "2025-12-10T00:30:00",
    imageUrl: "/mad-max.jpg",
    participantsCount: 480,
    participantsLimit: 500,
    status: "active",
    paymentInfo: "Стартовый взнос 1500 ₽",
    userParticipating: true,
    location: "Набережная, Таганрог",
    coordinates: { lat: 47.220, lon: 38.920 }
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
    location: "Драматический театр, Таганрог",
    coordinates: { lat: 47.238, lon: 38.895 }
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
    location: "Центр культуры, Таганрог",
    coordinates: { lat: 47.250, lon: 38.890 }
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
    location: "Торговый центр, Таганрог",
    coordinates: { lat: 47.230, lon: 38.910 }
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
    location: "Частный кинозал, Таганрог",
    coordinates: { lat: 47.240, lon: 38.900 }
    location: "Частный кинозал"
  },
  {
    id: "e7",
    title: "Премьера фильма «Барби»",
    shortDescription: "Розовый дресс-код и фотозона у входа.",
    description:
      "Специальный показ с интерактивом перед началом и мерчем в фойе. После фильма — обсуждение с кинокритиком.",
    startDate: "2025-12-18T19:00:00",
    endDate: "2025-12-18T21:30:00",
    imageUrl: "/barbie.jpg",
    participantsCount: 220,
    participantsLimit: 300,
    status: "active",
    paymentInfo: "Билеты от 700 ₽",
    userParticipating: false,
    location: "Кинотеатр Космос"
  },
  {
    id: "e8",
    title: "Ночной показ «Оппенгеймер»",
    shortDescription: "IMAX, 70 мм пленка и лекция о фильме.",
    description:
      "Ретроспектива Нолана, редкая пленочная копия, перед сеансом — лекция о физике проекта Manhattan.",
    startDate: "2025-12-15T23:00:00",
    endDate: "2025-12-16T02:30:00",
    imageUrl: "/opengamer.jpg",
    participantsCount: 260,
    participantsLimit: 280,
    status: "active",
    paymentInfo: "Билеты от 1200 ₽",
    userParticipating: true,
    location: "Каро 11 Октябрь"
  },
  {
    id: "e9",
    title: "Кинопоказ «Дюна: Часть вторая»",
    shortDescription: "Большой зал, субтитры и премиум звук.",
    description:
      "Показ в зале с Dolby Atmos. Перед фильмом — квиз по вселенной Герберта, призы от организаторов.",
    startDate: "2025-12-21T18:00:00",
    endDate: "2025-12-21T21:00:00",
    imageUrl: "/duna.jpg",
    participantsCount: 180,
    participantsLimit: 220,
    status: "active",
    paymentInfo: "Билеты от 950 ₽",
    userParticipating: false,
    location: "Синема Парк Афимолл"
  },
  {
    id: "e10",
    title: "Культовый показ «Бэтмен»",
    shortDescription: "Темный зал, живой саундтрек органом.",
    description:
      "Симфонический ансамбль играет ключевые темы во время сеанса. Эксклюзивный мерч DC в лобби.",
    startDate: "2025-12-29T19:30:00",
    endDate: "2025-12-29T22:30:00",
    imageUrl: "/batman2022.jpg",
    participantsCount: 140,
    participantsLimit: 200,
    status: "active",
    paymentInfo: "Билеты от 1100 ₽",
    userParticipating: false,
    location: "Театр Музыки и Кино"
  },
  {
    id: "e11",
    title: "Архипелаг: показ «Паразиты»",
    shortDescription: "Обсуждение феномена корейского кино.",
    description:
      "После показа — круглый стол с переводчиком и кинокритиком, кофе-брейк и нетворкинг.",
    startDate: "2025-12-11T18:30:00",
    endDate: "2025-12-11T21:00:00",
    imageUrl: "/parasite.webp",
    participantsCount: 95,
    participantsLimit: 120,
    status: "active",
    paymentInfo: "Билеты от 800 ₽",
    userParticipating: false,
    location: "Кинозал Гараж"
  },
  {
    id: "e12",
    title: "Музыкальный вечер «Джентльмены»",
    shortDescription: "Саундтрек фильма в живом исполнении.",
    description:
      "Группа играет треки из фильма, на экране — культовые сцены. Дресс-код в стиле Пирсона приветствуется.",
    startDate: "2025-12-20T20:00:00",
    endDate: "2025-12-20T22:00:00",
    imageUrl: "/gentelmen.jpg",
    participantsCount: 150,
    participantsLimit: 180,
    status: "active",
    paymentInfo: "Вход 900 ₽",
    userParticipating: true,
    location: "Главклуб"
  },
  {
    id: "e13",
    title: "Классика кино: «Космическая одиссея»",
    shortDescription: "4K ремастер на большом экране.",
    description:
      "Вступительное слово от киноведа о влиянии Кубрика. В антракте — выставка постеров и редких кадров.",
    startDate: "2025-12-26T19:00:00",
    endDate: "2025-12-26T22:10:00",
    imageUrl: "/odessey.jpg",
    participantsCount: 70,
    participantsLimit: 120,
    status: "active",
    paymentInfo: "Билеты от 850 ₽",
    userParticipating: false,
    location: "Москино Космос"
  },
  {
    id: "e14",
    title: "Детский утренник «Летние каникулы»",
    shortDescription: "Анимация, конкурсы и мастер-класс.",
    description:
      "Показ семейного мультфильма, аквагрим и мастер-класс по созданию бумажных зверят. Подарки каждому ребенку.",
    startDate: "2025-12-30T11:00:00",
    endDate: "2025-12-30T14:00:00",
    imageUrl: "/Vacaciones.jpg",
    participantsCount: 45,
    participantsLimit: 80,
    status: "active",
    paymentInfo: "Билеты от 500 ₽",
    userParticipating: false,
    location: "Культурный центр Зил"
  },
  {
    id: "e15",
    title: "Триллер-вечер «Достать ножи»",
    shortDescription: "Киновикторина и приз за лучший костюм.",
    description:
      "Зрители в образах персонажей получают бонусы. Викторина по сюжету и скрытым отсылкам, приз — коллекционный постер.",
    startDate: "2025-12-23T19:00:00",
    endDate: "2025-12-23T21:30:00",
    imageUrl: "/give-a-knife.webp",
    participantsCount: 85,
    participantsLimit: 100,
    status: "active",
    paymentInfo: "Билеты от 750 ₽",
    userParticipating: false,
    location: "Кинотеатр Пионер"
  }
];

export const fetchEvents = async (): Promise<Event[]> => {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return updateEventStatuses(mockEvents);
};

export const fetchEventById = async (id: string): Promise<Event | null> => {
  await new Promise((resolve) => setTimeout(resolve, 120));
  const found = mockEvents.find((item) => item.id === id);
  return found ? { ...found } : null;
};
