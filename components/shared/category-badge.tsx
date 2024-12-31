"use client";

import { Badge } from "../ui/badge";
import { CategoryData } from "@/types/category";
import Icon from "./icon";

export default function CategoryBadge({
  category,
}: {
  category: CategoryData;
}) {
  return (
    <Badge
      key={category._id}
      variant="outline"
      className={`mr-2`}
      style={{
        backgroundColor: `${category.color}26`,
        color: category.color,
      }}
    >
      <Icon name={category.icon} size={12} className="mr-2" />
      {category.name}
    </Badge>
  );
}
