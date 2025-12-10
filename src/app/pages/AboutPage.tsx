import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";

export const AboutPage = () => {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-6 flex items-center gap-3'>
        <Info className='h-8 w-8 text-primary' />
        <h1 className='text-3xl font-bold'>О проекте</h1>
      </div>

      <div className='max-w-4xl space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>myAfisha - Система электронной афиши</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground'>
              myAfisha - это современная платформа для просмотра и участия в событиях. Мы помогаем людям находить интересные мероприятия в их городе и легко присоединяться к ним.
            </p>

            <div>
              <h2 className='text-xl font-semibold mb-2'>Наши возможности</h2>
              <ul className='list-disc list-inside space-y-2 text-muted-foreground'>
                <li>Просмотр актуальных событий с подробной информацией</li>
                <li>Удобный поиск и фильтрация событий по категориям и датам</li>
                <li>Подтверждение участия в интересующих мероприятиях</li>
                <li>Управление своими событиями и билетами</li>
                <li>Отзывы и рейтинги событий</li>
                <li>Интеграция с картами для удобной навигации</li>
              </ul>
            </div>

            <div>
              <h2 className='text-xl font-semibold mb-2'>Для организаторов</h2>
              <p className='text-muted-foreground'>
                Администраторы могут создавать и управлять событиями, отслеживать участников, экспортировать списки и многое другое.
              </p>
            </div>

            <div>
              <h2 className='text-xl font-semibold mb-2'>Наша миссия</h2>
              <p className='text-muted-foreground'>
                Мы стремимся сделать участие в событиях максимально простым и удобным, объединяя людей вокруг интересных мероприятий и создавая незабываемые впечатления.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

