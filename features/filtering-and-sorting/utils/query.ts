import type { Attribute } from "@/shared/types/attribute";

export const SORT_OPTIONS = ["relevant", "price-asc", "price-desc", "alpha", "stock"] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

export type AttributeFilterValue =
  | { kind: "list"; values: string[] }
  | { kind: "boolean" }
  | { kind: "range"; min?: number; max?: number };

export type FilterState = {
  sort: SortOption;
  minPrice?: number;
  maxPrice?: number;
  brandIds: number[];
  colorIds: number[];
  sizeIds: number[];
  inStockOnly: boolean;
  attributes: Record<number, AttributeFilterValue>;
};

export type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseIdList(value: string | string[] | undefined): number[] {
  const raw = firstValue(value);
  if (!raw) {
    return [];
  }
  return raw
    .split(",")
    .map((id) => Number.parseInt(id, 10))
    .filter((id) => !Number.isNaN(id));
}

function parseStringList(value: string | string[] | undefined): string[] {
  const raw = firstValue(value);
  if (!raw) {
    return [];
  }
  return raw.split(",").filter((entry) => entry.length > 0);
}

function parseNumber(value: string | string[] | undefined): number | undefined {
  const raw = firstValue(value);
  if (raw === undefined) {
    return undefined;
  }
  const parsed = Number.parseFloat(raw);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export function parseFilterState(searchParams: SearchParams, attributes: Attribute[]): FilterState {
  const sortParam = firstValue(searchParams.sort);
  const sort = (SORT_OPTIONS as readonly string[]).includes(sortParam ?? "")
    ? (sortParam as SortOption)
    : "relevant";

  const attributeFilters: Record<number, AttributeFilterValue> = {};
  for (const attribute of attributes) {
    if (attribute.type === "boolean") {
      if (firstValue(searchParams[`attr_${attribute.id}`]) === "1") {
        attributeFilters[attribute.id] = { kind: "boolean" };
      }
    } else if (attribute.type === "text" || attribute.type === "select") {
      const values = parseStringList(searchParams[`attr_${attribute.id}`]);
      if (values.length > 0) {
        attributeFilters[attribute.id] = { kind: "list", values };
      }
    } else if (attribute.type === "number") {
      const min = parseNumber(searchParams[`attrMin_${attribute.id}`]);
      const max = parseNumber(searchParams[`attrMax_${attribute.id}`]);
      if (min !== undefined || max !== undefined) {
        attributeFilters[attribute.id] = { kind: "range", min, max };
      }
    }
  }

  return {
    sort,
    minPrice: parseNumber(searchParams.minPrice),
    maxPrice: parseNumber(searchParams.maxPrice),
    brandIds: parseIdList(searchParams.brand),
    colorIds: parseIdList(searchParams.color),
    sizeIds: parseIdList(searchParams.size),
    inStockOnly: firstValue(searchParams.inStock) === "1",
    attributes: attributeFilters,
  };
}

export function serializeFilterState(state: FilterState): string {
  const params = new URLSearchParams();

  if (state.sort !== "relevant") {
    params.set("sort", state.sort);
  }
  if (state.minPrice !== undefined) {
    params.set("minPrice", String(state.minPrice));
  }
  if (state.maxPrice !== undefined) {
    params.set("maxPrice", String(state.maxPrice));
  }
  if (state.brandIds.length > 0) {
    params.set("brand", state.brandIds.join(","));
  }
  if (state.colorIds.length > 0) {
    params.set("color", state.colorIds.join(","));
  }
  if (state.sizeIds.length > 0) {
    params.set("size", state.sizeIds.join(","));
  }
  if (state.inStockOnly) {
    params.set("inStock", "1");
  }
  for (const [attributeId, value] of Object.entries(state.attributes)) {
    if (value.kind === "list" && value.values.length > 0) {
      params.set(`attr_${attributeId}`, value.values.join(","));
    } else if (value.kind === "boolean") {
      params.set(`attr_${attributeId}`, "1");
    } else if (value.kind === "range") {
      if (value.min !== undefined) {
        params.set(`attrMin_${attributeId}`, String(value.min));
      }
      if (value.max !== undefined) {
        params.set(`attrMax_${attributeId}`, String(value.max));
      }
    }
  }

  return params.toString();
}

export function hasActiveFilters(state: FilterState): boolean {
  return (
    state.minPrice !== undefined ||
    state.maxPrice !== undefined ||
    state.brandIds.length > 0 ||
    state.colorIds.length > 0 ||
    state.sizeIds.length > 0 ||
    state.inStockOnly ||
    Object.keys(state.attributes).length > 0
  );
}

export function buildRelevantSeed(categorySlug: string, state: FilterState): string {
  const filterOnlyQuery = serializeFilterState({ ...state, sort: "relevant" });
  return `${categorySlug}:${filterOnlyQuery}`;
}

export function clearedFilterState(state: FilterState): FilterState {
  return {
    sort: state.sort,
    brandIds: [],
    colorIds: [],
    sizeIds: [],
    inStockOnly: false,
    attributes: {},
  };
}
