import { Category } from "@/payload-types";
import CategoryDropdown from "./CategoryDropdown";

interface CategoriesProps {
  data: any;
}
export default function Categories({data}: CategoriesProps) {
  return (
    <div className="flex gap-2 flex-nowrap items-center">
      {data.map((category: Category) => (
          <CategoryDropdown
            category={category}
            isActive={false}
            isNavigationHovered={false}
            key={category.id}
          />
      ))}
    </div>
  );
}
