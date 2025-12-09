import { Link } from "react-router-dom";
import { Home } from "lucide-react";

import { PATHS } from "@shared/constants";
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/ui/card";

export const NotFoundPage = () => {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='text-6xl font-bold'>404</CardTitle>
          <CardDescription className='text-lg'>Страница не найдена</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4 text-center'>
          <p className='text-muted-foreground'>
            Запрашиваемая страница не существует или была перемещена
          </p>
          <Button asChild className='gap-2'>
            <Link to='/'>
              <Home className='h-4 w-4' />
              Вернуться на главную
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

