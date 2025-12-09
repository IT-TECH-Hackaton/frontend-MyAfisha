export const RootPage = () => (
  <div className='container mx-auto px-4 py-8'>
    <h1 className='mb-8 text-3xl font-bold'>Афиша</h1>
    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
      <div className='rounded-lg border p-4'>
        <p className='text-muted-foreground'>Здесь будет отображаться афиша событий</p>
      </div>
    </div>
  </div>
);
