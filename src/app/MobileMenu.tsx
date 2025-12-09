import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { Menu, X, User, Ticket, Search, Shield } from "lucide-react";

import { AUTH_KEY, PATHS } from "@shared/constants";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { ThemeToggle } from "@shared/ui/theme-toggle";
import { LogoutButton } from "@modules/auth";
import { useGetProfileQuery } from "@modules/user/api/hooks/useGetProfileQuery";
import { cn } from "@shared/lib/utils";

export const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={toggleMenu} variant='ghost' size='icon' className='md:hidden'>
        {isOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
      </Button>
      {isOpen && (
        <>
          <div
            className='fixed inset-0 z-40 bg-black/50 md:hidden'
            onClick={closeMenu}
            aria-hidden='true'
          />
          <div
            className={cn(
              "fixed right-0 top-0 z-50 h-full w-64 border-l bg-background p-4 shadow-lg transition-transform md:hidden",
              isOpen ? "translate-x-0" : "translate-x-full"
            )}
          >
            <div className='flex flex-col gap-4'>
              {isEventsPage && (
                <div className='relative'>
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
              {isAuth ? (
                <>
                  <Button asChild variant='ghost' className='w-full justify-start gap-2' onClick={closeMenu}>
                    <Link to={PATHS.PROFILE}>
                      <User className='h-4 w-4' />
                      Профиль
                    </Link>
                  </Button>
                  <Button asChild variant='ghost' className='w-full justify-start gap-2' onClick={closeMenu}>
                    <Link to={PATHS.TICKETS}>
                      <Ticket className='h-4 w-4' />
                      Мои афиши
                    </Link>
                  </Button>
                  {isAdmin && (
                    <Button asChild variant='ghost' className='w-full justify-start gap-2' onClick={closeMenu}>
                      <Link to={PATHS.ADMIN}>
                        <Shield className='h-4 w-4' />
                        Админ
                      </Link>
                    </Button>
                  )}
                  <div className='border-t pt-4'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-muted-foreground'>Тема</span>
                      <ThemeToggle />
                    </div>
                  </div>
                  <div onClick={closeMenu}>
                    <LogoutButton />
                  </div>
                </>
              ) : (
                <>
                  <Button asChild variant='outline' className='w-full' onClick={closeMenu}>
                    <Link to={PATHS.SIGNIN}>Войти</Link>
                  </Button>
                  <Button asChild className='w-full' onClick={closeMenu}>
                    <Link to={PATHS.SIGNUP}>Регистрация</Link>
                  </Button>
                  <div className='border-t pt-4'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-muted-foreground'>Тема</span>
                      <ThemeToggle />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

