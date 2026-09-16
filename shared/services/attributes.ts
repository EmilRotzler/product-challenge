import attributesJson from "@/data/attributes.json";
import type { Attribute } from "@/shared/types/attribute";

const attributes = attributesJson as unknown as Attribute[];

export function getAttributeById(attributeId: number): Attribute | undefined {
  return attributes.find((attribute) => attribute.id === attributeId);
}

export function getAllAttributes(): Attribute[] {
  return attributes;
}
