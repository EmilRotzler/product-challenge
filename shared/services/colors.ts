import colorsJson from "@/data/colors.json";
import type { Color } from "@/shared/types/color";

const colors = colorsJson as unknown as Color[];

export function getColorById(colorId: number): Color | undefined {
  return colors.find((color) => color.id === colorId);
}
