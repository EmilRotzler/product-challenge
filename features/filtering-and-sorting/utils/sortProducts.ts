import type { Product } from "@/shared/types/product";
import type { SortOption } from "./query";
import { seededShuffle } from "./seededShuffle";

function getEffectivePrice(product: Product): number {
  return product.onSale ? product.salePrice : product.price;
}

export function sortProducts(products: Product[], sort: SortOption, seed: string): Product[] {
  switch (sort) {
    case "price-asc":
      return [...products].sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
    case "price-desc":
      return [...products].sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
    case "alpha":
      return [...products].sort((a, b) => a.name.localeCompare(b.name));
    case "stock":
      return [...products].sort((a, b) => Number(b.inStock) - Number(a.inStock));
    case "relevant":
    default:
      return seededShuffle(products, seed);
  }
}
