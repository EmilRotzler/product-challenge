import type { Product } from "@/shared/types/product";
import type { FilterState } from "./query";

function getEffectivePrice(product: Product): number {
  return product.onSale ? product.salePrice : product.price;
}

function matchesAttributes(product: Product, attributes: FilterState["attributes"]): boolean {
  for (const [attributeIdKey, filterValue] of Object.entries(attributes)) {
    const attributeId = Number(attributeIdKey);
    const match = product.customAttributes.find((entry) => entry.attributeId === attributeId);
    if (!match) {
      return false;
    }
    if (filterValue.kind === "boolean") {
      if (match.value !== true) {
        return false;
      }
    } else if (filterValue.kind === "list") {
      if (!filterValue.values.includes(String(match.value))) {
        return false;
      }
    } else if (filterValue.kind === "range") {
      const numericValue = Number(match.value);
      if (filterValue.min !== undefined && numericValue < filterValue.min) {
        return false;
      }
      if (filterValue.max !== undefined && numericValue > filterValue.max) {
        return false;
      }
    }
  }
  return true;
}

export function filterProducts(products: Product[], state: FilterState): Product[] {
  return products.filter((product) => {
    const price = getEffectivePrice(product);
    if (state.minPrice !== undefined && price < state.minPrice) {
      return false;
    }
    if (state.maxPrice !== undefined && price > state.maxPrice) {
      return false;
    }
    if (state.brandIds.length > 0 && !state.brandIds.includes(product.brandId)) {
      return false;
    }
    if (state.colorIds.length > 0 && !state.colorIds.includes(product.colorId)) {
      return false;
    }
    if (state.sizeIds.length > 0 && !state.sizeIds.includes(product.sizeId)) {
      return false;
    }
    if (state.inStockOnly && !product.inStock) {
      return false;
    }
    return matchesAttributes(product, state.attributes);
  });
}
