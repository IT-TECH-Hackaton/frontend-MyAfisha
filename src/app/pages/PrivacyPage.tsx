import { Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";

export const PrivacyPage = () => {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-6 flex items-center gap-3'>
        <Shield className='h-8 w-8 text-primary' />
        <h1 className='text-3xl font-bold'>Политика конфиденциальности</h1>
      </div>

      <div className='max-w-4xl space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>Общие положения</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground'>
              Настоящая политика конфиденциальности описывает, как мы собираем, используем и защищаем вашу персональную информацию при использовании сервиса myAfisha.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Собираемая информация</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground mb-2'>Мы можем собирать следующую информацию:</p>
            <ul className='list-disc list-inside space-y-2 text-muted-foreground'>
              <li>Имя и контактные данные (при регистрации)</li>
              <li>Адрес электронной почты</li>
              <li>Информация о вашем участии в событиях</li>
              <li>Технические данные (IP-адрес, тип браузера, устройство)</li>
              <li>Данные о взаимодействии с сервисом</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Использование информации</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground mb-2'>Мы используем собранную информацию для:</p>
            <ul className='list-disc list-inside space-y-2 text-muted-foreground'>
              <li>Предоставления и улучшения наших услуг</li>
              <li>Связи с вами по вопросам вашей учетной записи и событий</li>
              <li>Отправки уведомлений о событиях и обновлениях</li>
              <li>Обеспечения безопасности и предотвращения мошенничества</li>
              <li>Анализа использования сервиса для улучшения функциональности</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Защита данных</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground'>
              Мы применяем современные методы защиты данных, включая шифрование, безопасное хранение и ограниченный доступ к персональной информации. Однако ни один метод передачи данных через интернет не является абсолютно безопасным.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Передача данных третьим лицам</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground'>
              Мы не продаем и не передаем вашу персональную информацию третьим лицам, за исключением случаев, когда это необходимо для предоставления услуг, требуется по закону, или с вашего явного согласия.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ваши права</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground mb-2'>Вы имеете право:</p>
            <ul className='list-disc list-inside space-y-2 text-muted-foreground'>
              <li>Получать доступ к своей персональной информации</li>
              <li>Исправлять неточные данные</li>
              <li>Удалять свою учетную запись и данные</li>
              <li>Отказываться от получения маркетинговых сообщений</li>
              <li>Ограничивать обработку ваших данных</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cookies</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground'>
              Мы используем cookies и аналогичные технологии для улучшения работы сервиса, анализа использования и персонализации контента. Вы можете управлять настройками cookies в своем браузере.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Изменения в политике</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground'>
              Мы можем периодически обновлять настоящую политику конфиденциальности. О существенных изменениях мы уведомим вас через сервис или по электронной почте.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Контакты</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground'>
              Если у вас есть вопросы о настоящей политике конфиденциальности или вы хотите реализовать свои права, пожалуйста, свяжитесь с нами по адресу: info@myafisha.ru
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

