import type { Movie } from "@modules/movies/types/moive";

export const mockMovies: Movie[] = [
  {
    id: "1",
    title: "Уикенд с батей",
    ageRating: "16+",
    type: "Фильм",
    genre: "фантастика",
    country: "США",
    year: 2023,
    rating: 4.5,
    kinopoiskRating: 8.4,
    posterUrl: "/uikend_c_batey.webp"
  },
  {
    id: "2",
    title: "Пёс",
    ageRating: "12+",
    type: "Фильм",
    genre: "фантастика",
    country: "США",
    year: 2023,
    rating: 4.5,
    kinopoiskRating: 8.4,
    posterUrl: "/pec.jpg"
  },
  {
    id: "3",
    title: "Быть Сальвадором",
    ageRating: "16+",
    type: "Фильм",
    genre: "фантастика",
    country: "США",
    year: 2023,
    rating: 4,
    kinopoiskRating: 8.4,
    posterUrl: "/be_salvador.jpg"
  },
  {
    id: "4",
    title: "Космическая одиссея",
    ageRating: "12+",
    type: "Фильм",
    genre: "sci-fi",
    country: "США",
    year: 2024,
    rating: 5,
    kinopoiskRating: 9.1,
    posterUrl: "/odessey.jpg"
  },
  {
    id: "5",
    title: "Тайна старого замка",
    ageRating: "12+",
    type: "Фильм",
    genre: "детектив",
    country: "Великобритания",
    year: 2024,
    rating: 4,
    kinopoiskRating: 7.8,
    posterUrl: "/castle.webp"
  },
  {
    id: "6",
    title: "Летние каникулы",
    ageRating: "0+",
    type: "Фильм",
    genre: "комедия",
    country: "Россия",
    year: 2024,
    rating: 3.5,
    kinopoiskRating: 6.5,
    posterUrl: "/Vacaciones.jpg"
  },
  {
    id: "7",
    title: "Дюна: Часть вторая",
    ageRating: "12+",
    type: "Фильм",
    genre: "sci-fi",
    country: "США",
    year: 2024,
    rating: 4.7,
    kinopoiskRating: 8.7,
    posterUrl: "/duna.jpg"
  },
  {
    id: "8",
    title: "Оппенгеймер",
    ageRating: "18+",
    type: "Фильм",
    genre: "драма",
    country: "США",
    year: 2023,
    rating: 4.8,
    kinopoiskRating: 8.8,
    posterUrl: "/opengamer.jpg"
  },
  {
    id: "9",
    title: "Барби",
    ageRating: "12+",
    type: "Фильм",
    genre: "комедия",
    country: "США",
    year: 2023,
    rating: 4.2,
    kinopoiskRating: 7.3,
    posterUrl: "/barbie.jpg"
  },
  {
    id: "10",
    title: "Человек-паук: Паутина вселенных",
    ageRating: "12+",
    type: "Фильм",
    genre: "анимация",
    country: "США",
    year: 2023,
    rating: 4.9,
    kinopoiskRating: 8.9,
    posterUrl: "/Spider_man.jpg"
  },
  {
    id: "11",
    title: "Паразиты",
    ageRating: "18+",
    type: "Фильм",
    genre: "триллер",
    country: "Южная Корея",
    year: 2019,
    rating: 4.8,
    kinopoiskRating: 8.6,
    posterUrl: "/parasite.webp"
  },
  {
    id: "12",
    title: "Бэтмен",
    ageRating: "16+",
    type: "Фильм",
    genre: "боевик",
    country: "США",
    year: 2022,
    rating: 4.4,
    kinopoiskRating: 7.7,
    posterUrl: "/batman2022.jpg"
  },
  {
    id: "13",
    title: "Джентльмены",
    ageRating: "18+",
    type: "Фильм",
    genre: "криминал",
    country: "Великобритания",
    year: 2019,
    rating: 4.6,
    kinopoiskRating: 8.4,
    posterUrl: "/gentelmen.jpg"
  },
  {
    id: "14",
    title: "Достать ножи",
    ageRating: "16+",
    type: "Фильм",
    genre: "детектив",
    country: "США",
    year: 2019,
    rating: 4.5,
    kinopoiskRating: 7.9,
    posterUrl: "/give-a-knife.webp"
  },
  {
    id: "15",
    title: "Безумный Макс: Дорога ярости",
    ageRating: "18+",
    type: "Фильм",
    genre: "боевик",
    country: "Австралия",
    year: 2015,
    rating: 4.7,
    kinopoiskRating: 8.1,
    posterUrl: "/mad-max.jpg"
  },
  {
    id: "16",
    title: "Начало",
    ageRating: "16+",
    type: "Фильм",
    genre: "sci-fi",
    country: "США",
    year: 2010,
    rating: 4.8,
    kinopoiskRating: 8.7,
    posterUrl: "/start.jpg"
  }
];
export async function fetchMovies(): Promise<Movie[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockMovies;
}
