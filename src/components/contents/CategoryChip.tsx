import { Badge } from "@/components/ui/Badge";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { Category } from "../../schemas/content";

interface CategoryChipProps {
  category: Category | undefined;
}

export default function CategoryChip({ category }: CategoryChipProps) {
  if (!category) return null;
  return (
    <Badge
      style={{
        backgroundColor: `${category.color}22`,
        color: category.color,
        borderColor: `${category.color}55`,
      }}
    >
      <DynamicIcon name={category.iconName} size={12} />
      {category.name}
    </Badge>
  );
}
