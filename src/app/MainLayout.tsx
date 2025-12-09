import { Link, Outlet, useSearchParams, useLocation } from "react-router-dom";
import { User, Ticket, Search, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AUTH_KEY, PATHS } from "@shared/constants";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { ThemeToggle } from "@shared/ui/theme-toggle";
import { LogoutButton } from "@modules/auth";
import { useGetProfileQuery } from "@modules/user/api/hooks/useGetProfileQuery";
import { MobileMenu } from "./MobileMenu";
import { Footer } from "./Footer";

export const MainLayout = () => {
  const isAuth = localStorage.getItem(AUTH_KEY) === "true";
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isEventsPage = location.pathname === "/";
  const { data: profileData } = useGetProfileQuery({
    options: {
      enabled: isAuth
    }
  });
  
  const userRole = profileData?.data?.role?.toLowerCase();
  const isAdmin = isAuth && (userRole === "admin" || userRole === "администратор");

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    setSearchQuery(urlSearch);
  }, [searchParams]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      if (isEventsPage) {
        const newParams = new URLSearchParams(searchParams);
        if (searchQuery) {
          newParams.set("search", searchQuery);
        } else {
          newParams.delete("search");
        }
        setSearchParams(newParams, { replace: true });
      }
    }, 500);
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, isEventsPage, searchParams, setSearchParams]);

  return (
    <div className='flex min-h-screen flex-col'>
      <header className='border-b'>
        <div className='container mx-auto flex h-16 items-center justify-between gap-4 px-4'>
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
                {isAdmin && (
                  <Button asChild variant='ghost' className='gap-2'>
                    <Link to={PATHS.ADMIN}>
                      <Shield className='h-4 w-4' />
                      Админ
                    </Link>
                  </Button>
                )}
              </nav>
            )}
          </div>
          {isEventsPage && (
            <div className='relative hidden flex-1 max-w-md md:block'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                type='text'
                placeholder='Поиск по названию или описанию...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-9'
              />
            </div>
          )}
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

