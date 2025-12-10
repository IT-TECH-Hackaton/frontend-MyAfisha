import { Mail, MapPin, Phone, MessageSquare, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Button } from "@shared/ui/button";

export const ContactsPage = () => {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>Контакты</h1>
        <p className='text-muted-foreground mt-2'>Свяжитесь с нами любым удобным способом</p>
      </div>

      <div className='max-w-4xl space-y-6'>
        <div className='grid gap-6 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <MapPin className='h-5 w-5' />
                Адрес
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>
                Таганрог, Россия
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Phone className='h-5 w-5' />
                Телефон
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href='tel:+79001234567'
                className='text-primary hover:underline transition-colors'
              >
                +7 (900) 123-45-67
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Mail className='h-5 w-5' />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href='mailto:info@myafisha.ru'
                className='text-primary hover:underline transition-colors'
              >
                info@myafisha.ru
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Clock className='h-5 w-5' />
                Время работы
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>
                Пн-Пт: 9:00 - 18:00<br />
                Сб-Вс: Выходной
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <MessageSquare className='h-5 w-5' />
              Напишите нам
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground'>
              Если у вас есть вопросы, предложения или вы хотите сообщить о проблеме, пожалуйста, свяжитесь с нами по электронной почте или телефону.
            </p>
            <div className='flex gap-2'>
              <Button asChild>
                <a href='mailto:info@myafisha.ru'>Отправить email</a>
              </Button>
              <Button variant='outline' asChild>
                <a href='tel:+79001234567'>Позвонить</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Обратная связь</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground'>
              Мы ценим ваше мнение и всегда готовы помочь. Обычно мы отвечаем на запросы в течение 24 часов в рабочие дни.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

