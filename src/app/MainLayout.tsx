import { Link, Outlet } from "react-router-dom";
import { User, Ticket } from "lucide-react";

import { AUTH_KEY, PATHS } from "@shared/constants";
import { Button } from "@shared/ui/button";
import { ThemeToggle } from "@shared/ui/theme-toggle";
import { LogoutButton } from "@modules/auth";
import { MobileMenu } from "./MobileMenu";
import { Footer } from "./Footer";

export const MainLayout = () => {
  const isAuth = localStorage.getItem(AUTH_KEY) === "true";

  return (
    <div className='flex min-h-screen flex-col'>
      <header className='border-b'>
        <div className='container mx-auto flex h-16 items-center justify-between px-4'>
          <div className='flex items-center gap-6'>
            <Link to='/' className='flex items-center gap-2'>
              <span className='text-2xl font-bold'>myAfisha</span>
            </Link>
            {isAuth && (
              <nav className='hidden items-center gap-2 md:flex'>
                <Button asChild variant='ghost' className='gap-2'>
                  <Link to={PATHS.PROFILE}>
                    <User className='h-4 w-4' />
                    Профиль
                  </Link>
                </Button>
                <Button asChild variant='ghost' className='gap-2'>
                  <Link to={PATHS.TICKETS}>
                    <Ticket className='h-4 w-4' />
                    Мои афиши
                  </Link>
                </Button>
              </nav>
            )}
          </div>
          <div className='flex items-center gap-4'>
            {isAuth ? (
              <>
                <div className='hidden items-center gap-4 md:flex'>
                  <LogoutButton />
                  <ThemeToggle />
                </div>
                <MobileMenu />
              </>
            ) : (
              <>
                <div className='hidden items-center gap-4 md:flex'>
                  <Button asChild variant='outline'>
                    <Link to={PATHS.SIGNIN}>Войти</Link>
                  </Button>
                  <Button asChild>
                    <Link to={PATHS.SIGNUP}>Регистрация</Link>
                  </Button>
                  <ThemeToggle />
                </div>
                <MobileMenu />
              </>
            )}
          </div>
        </div>
      </header>
      <main className='flex-1'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

