import { Button } from "@shared/ui/button";
import { CategoriesTableSkeleton } from "./CategoriesTableSkeleton";
import type { Category } from "@modules/categories/api/requests/getCategories";

interface CategoriesTableProps {
  categories: Category[];
  isLoading: boolean;
  onEditCategory: (category: Category) => void;
}

export const CategoriesTable = ({
  categories,
  isLoading,
  onEditCategory
}: CategoriesTableProps) => {
  if (isLoading) {
    return <CategoriesTableSkeleton />;
  }

  if (categories.length === 0) {
    return (
      <tr>
        <td colSpan={3} className='text-center p-5'>
          Категории не найдены
        </td>
      </tr>
    );
  }

  return (
    <>
      {categories.map((category) => (
        <tr key={category.id} className='hover:bg-muted/35'>
          <td className='px-4 py-3 text-left border-b border-border'>{category.name}</td>
          <td className='px-4 py-3 text-left border-b border-border'>
            {category.description || "—"}
          </td>
          <td className='px-4 py-3 text-right border-b border-border'>
            <Button
              variant='default'
              size='sm'
              onClick={() => onEditCategory(category)}
            >
              Редактировать
            </Button>
          </td>
        </tr>
      ))}
    </>
  );
};