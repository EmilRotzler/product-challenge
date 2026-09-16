import type { Product } from "@/shared/types/product";
import type { Attribute } from "@/shared/types/attribute";
import type { Brand } from "@/shared/types/brand";
import type { Color } from "@/shared/types/color";
import type { Size } from "@/shared/types/size";

export type AttributeOption = {
  attribute: Attribute;
  distinctValues: string[];
};

export type FilterOptions = {
  brands: Brand[];
  colors: Color[];
  sizes: Size[];
  attributeOptions: AttributeOption[];
};

export function getFilterOptions(
  products: Product[],
  allBrands: Brand[],
  allColors: Color[],
  allSizes: Size[],
  allAttributes: Attribute[],
): FilterOptions {
  const brandIds = new Set(products.map((product) => product.brandId));
  const colorIds = new Set(products.map((product) => product.colorId));
  const sizeIds = new Set(products.map((product) => product.sizeId));
  const attributeIdsPresent = new Set(
    products.flatMap((product) => product.customAttributes.map((entry) => entry.attributeId)),
  );

  const attributeOptions: AttributeOption[] = allAttributes
    .filter((attribute) => attributeIdsPresent.has(attribute.id))
    .map((attribute) => {
      if (attribute.type !== "text" && attribute.type !== "select") {
        return { attribute, distinctValues: [] };
      }
      const values = new Set<string>();
      for (const product of products) {
        const match = product.customAttributes.find((entry) => entry.attributeId === attribute.id);
        if (match) {
          values.add(String(match.value));
        }
      }
      return { attribute, distinctValues: [...values].sort() };
    });

  return {
    brands: allBrands.filter((brand) => brandIds.has(brand.id)),
    colors: allColors.filter((color) => colorIds.has(color.id)),
    sizes: allSizes.filter((size) => sizeIds.has(size.id)),
    attributeOptions,
  };
}
