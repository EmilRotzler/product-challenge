export type CustomAttributeValue = {
  attributeId: number;
  value: string | number | boolean;
};

type ProductBase = {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  price: number;
  inStock: boolean;
  brandId: number;
  colorId: number;
  sizeId: number;
  customAttributes: CustomAttributeValue[];
};

export type Product =
  | (ProductBase & { onSale: true; salePrice: number })
  | (ProductBase & { onSale: false; salePrice?: undefined });
