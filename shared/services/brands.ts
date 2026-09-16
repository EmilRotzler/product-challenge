import brandsJson from "@/data/brands.json";
import type { Brand } from "@/shared/types/brand";

const brands = brandsJson as unknown as Brand[];

export function getBrandById(brandId: number): Brand | undefined {
  return brands.find((brand) => brand.id === brandId);
}

export function getAllBrands(): Brand[] {
  return brands;
}
