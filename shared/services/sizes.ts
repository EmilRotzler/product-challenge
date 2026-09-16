import sizesJson from "@/data/sizes.json";
import type { Size } from "@/shared/types/size";

const sizes = sizesJson as unknown as Size[];

export function getSizeById(sizeId: number): Size | undefined {
  return sizes.find((size) => size.id === sizeId);
}

export function getAllSizes(): Size[] {
  return sizes;
}
