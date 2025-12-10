import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";

export const TermsPage = () => {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-6 flex items-center gap-3'>
        <FileText className='h-8 w-8 text-primary' />
        <h1 className='text-3xl font-bold'>Правила использования</h1>
      </div>

      <div className='max-w-4xl space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>Общие положения</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground'>
              Используя сервис myAfisha, вы соглашаетесь с настоящими правилами использования. Если вы не согласны с какими-либо условиями, пожалуйста, не используйте наш сервис.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Регистрация и учетная запись</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <ul className='list-disc list-inside space-y-2 text-muted-foreground'>
              <li>Для использования некоторых функций сервиса требуется регистрация</li>
              <li>Вы несете ответственность за сохранность своих учетных данных</li>
              <li>Запрещается передавать свою учетную запись третьим лицам</li>
              <li>Вы обязуетесь предоставлять достоверную информацию при регистрации</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Участие в событиях</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <ul className='list-disc list-inside space-y-2 text-muted-foreground'>
              <li>Подтверждая участие в событии, вы обязуетесь соблюдать правила, установленные организатором</li>
              <li>Отмена участия должна быть выполнена в разумные сроки</li>
              <li>Организатор события несет ответственность за проведение мероприятия</li>
              <li>Платформа не несет ответственности за качество проведения событий</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Поведение пользователей</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <ul className='list-disc list-inside space-y-2 text-muted-foreground'>
              <li>Запрещается публиковать оскорбительный, незаконный или вредоносный контент</li>
              <li>Запрещается использовать сервис для мошенничества или обмана</li>
              <li>Запрещается нарушать права других пользователей</li>
              <li>Администрация оставляет за собой право удалять контент и блокировать пользователей</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Интеллектуальная собственность</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground'>
              Весь контент платформы, включая дизайн, тексты, изображения и программное обеспечение, защищен авторским правом. Использование материалов без разрешения запрещено.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Изменения в правилах</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground'>
              Мы оставляем за собой право изменять настоящие правила в любое время. Изменения вступают в силу с момента публикации на сайте. Продолжая использовать сервис после изменений, вы соглашаетесь с новыми условиями.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

