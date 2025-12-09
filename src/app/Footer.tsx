import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";

import { PATHS } from "@shared/constants";
import { cn } from "@shared/lib/utils";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='border-t bg-muted/40'>
      <div className='container mx-auto px-4 py-12'>
        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
          <div className='space-y-4'>
            <Link to='/' className='flex items-center gap-2'>
              <span className='text-2xl font-bold'>myAfisha</span>
            </Link>
            <p className='text-sm text-muted-foreground'>
              Система электронной афиши для просмотра и участия в событиях. Откройте для себя интересные мероприятия в вашем городе.
            </p>
            <div className='flex gap-4'>
              <a
                href='#'
                className='rounded-full p-2 text-muted-foreground transition hover:bg-accent hover:text-foreground'
                aria-label='ВКонтакте'
              >
                <Twitter className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='rounded-full p-2 text-muted-foreground transition hover:bg-accent hover:text-foreground'
                aria-label='Instagram'
              >
                <Instagram className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='rounded-full p-2 text-muted-foreground transition hover:bg-accent hover:text-foreground'
                aria-label='Facebook'
              >
                <Facebook className='h-5 w-5' />
              </a>
            </div>
          </div>

          <div className='space-y-4'>
            <h3 className='text-sm font-semibold'>Навигация</h3>
            <nav className='flex flex-col gap-2'>
              <Link
                to='/'
                className='text-sm text-muted-foreground transition hover:text-foreground'
              >
                События
              </Link>
              <Link
                to={PATHS.PROFILE}
                className='text-sm text-muted-foreground transition hover:text-foreground'
              >
                Профиль
              </Link>
              <Link
                to={PATHS.TICKETS}
                className='text-sm text-muted-foreground transition hover:text-foreground'
              >
                Мои билеты
              </Link>
              <Link
                to={PATHS.SIGNIN}
                className='text-sm text-muted-foreground transition hover:text-foreground'
              >
                Войти
              </Link>
            </nav>
          </div>

          <div className='space-y-4'>
            <h3 className='text-sm font-semibold'>Информация</h3>
            <nav className='flex flex-col gap-2'>
              <a href='#' className='text-sm text-muted-foreground transition hover:text-foreground'>
                О проекте
              </a>
              <a href='#' className='text-sm text-muted-foreground transition hover:text-foreground'>
                Правила использования
              </a>
              <a href='#' className='text-sm text-muted-foreground transition hover:text-foreground'>
                Политика конфиденциальности
              </a>
              <a href='#' className='text-sm text-muted-foreground transition hover:text-foreground'>
                Контакты
              </a>
            </nav>
          </div>

          <div className='space-y-4'>
            <h3 className='text-sm font-semibold'>Контакты</h3>
            <div className='flex flex-col gap-3 text-sm text-muted-foreground'>
              <div className='flex items-center gap-2'>
                <MapPin className='h-4 w-4' />
                <span>Таганрог, Россия</span>
              </div>
              <div className='flex items-center gap-2'>
                <Phone className='h-4 w-4' />
                <a href='tel:+79001234567' className='transition hover:text-foreground'>
                  +7 (900) 123-45-67
                </a>
              </div>
              <div className='flex items-center gap-2'>
                <Mail className='h-4 w-4' />
                <a href='mailto:info@myafisha.ru' className='transition hover:text-foreground'>
                  info@myafisha.ru
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-8 border-t pt-8'>
          <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
            <p className='text-sm text-muted-foreground'>
              © {currentYear} myAfisha. Все права защищены.
            </p>
            <p className='text-sm text-muted-foreground'>
              Сделано с ❤️ для любителей событий
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

