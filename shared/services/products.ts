import productsJson from "@/data/products.json";
import type { Product } from "@/shared/types/product";

const products = productsJson as unknown as Product[];

export function getProductsByCategoryIds(categoryIds: number[]): Product[] {
  const idSet = new Set(categoryIds);
  return products.filter((product) => idSet.has(product.categoryId));
}
