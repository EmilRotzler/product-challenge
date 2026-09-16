import categoriesJson from "@/data/categories.json";
import type { Category } from "@/shared/types/category";

const categories = categoriesJson as unknown as Category[];

export function getTopLevelCategories(): Category[] {
  return categories.filter((category) => category.parentId === null);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getCategoryById(categoryId: number): Category | undefined {
  return categories.find((category) => category.id === categoryId);
}

export function getCategoryAncestors(categoryId: number): Category[] {
  const ancestors: Category[] = [];
  let current = getCategoryById(categoryId);

  while (current && current.parentId !== null) {
    const parent = getCategoryById(current.parentId);
    if (!parent) {
      break;
    }
    ancestors.unshift(parent);
    current = parent;
  }

  return ancestors;
}

export function getChildCategories(categoryId: number): Category[] {
  return categories.filter((category) => category.parentId === categoryId);
}

export function getCategoryAndDescendantIds(categoryId: number): number[] {
  const ids = [categoryId];
  for (const child of getChildCategories(categoryId)) {
    ids.push(...getCategoryAndDescendantIds(child.id));
  }
  return ids;
}
