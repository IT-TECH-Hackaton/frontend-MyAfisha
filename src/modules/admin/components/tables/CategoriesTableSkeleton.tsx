export const CategoriesTableSkeleton = () => {
  return Array.from({ length: 5 }).map((_, index) => (
    <tr key={`skeleton-category-${index}`}>
      <td className='px-4 py-3 text-left border-b border-border'>
        <div className='h-4 w-[200px] rounded bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-[skeleton-loading_1.5s_ease-in-out_infinite]' />
      </td>
      <td className='px-4 py-3 text-left border-b border-border'>
        <div className='h-4 w-[300px] rounded bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-[skeleton-loading_1.5s_ease-in-out_infinite]' />
      </td>
      <td className='px-4 py-3 text-right border-b border-border'>
        <div className='h-8 w-[150px] rounded-md ml-auto bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-[skeleton-loading_1.5s_ease-in-out_infinite]' />
      </td>
    </tr>
  ));
};