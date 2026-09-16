import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "..", "data");

function readJson(filename) {
  return JSON.parse(readFileSync(path.join(dataDir, filename), "utf8"));
}

const categories = readJson("categories.json");
const brands = readJson("brands.json");
const colors = readJson("colors.json");
const sizes = readJson("sizes.json");
const attributes = readJson("attributes.json");
const products = readJson("products.json");

const errors = [];
function expect(condition, message) {
  if (!condition) errors.push(message);
}

const categoryIds = new Set(categories.map((c) => c.id));
const brandIds = new Set(brands.map((b) => b.id));
const colorIds = new Set(colors.map((c) => c.id));
const sizeIds = new Set(sizes.map((s) => s.id));
const attributeIds = new Set(attributes.map((a) => a.id));

for (const [label, ids] of [
  ["categories", categoryIds],
  ["brands", brandIds],
  ["colors", colorIds],
  ["sizes", sizeIds],
  ["attributes", attributeIds],
]) {
  for (const id of ids) {
    expect(Number.isInteger(id), `${label} id ${id} is not an integer`);
  }
}

expect(categories.some((c) => c.parentId !== null), "expected at least one nested category (non-null parentId)");
for (const cat of categories) {
  expect(cat.parentId === null || categoryIds.has(cat.parentId), `category ${cat.id} has unknown parentId ${cat.parentId}`);
}

const largeCategoryProducts = products.filter((p) => p.categoryId === 2);
expect(largeCategoryProducts.length === 1000, `expected 1000 products in the large category, got ${largeCategoryProducts.length}`);

const customCategoryProducts = products.filter((p) => p.categoryId === 3 || p.categoryId === 4);
for (const p of customCategoryProducts) {
  expect(p.customAttributes.length > 0, `expected product ${p.id} in custom-attributes category to have customAttributes`);
}

for (const p of products) {
  expect(Number.isInteger(p.id), `product id ${p.id} is not an integer`);
  expect(categoryIds.has(p.categoryId), `product ${p.id} has unknown categoryId ${p.categoryId}`);
  expect(brandIds.has(p.brandId), `product ${p.id} has unknown brandId ${p.brandId}`);
  expect(colorIds.has(p.colorId), `product ${p.id} has unknown colorId ${p.colorId}`);
  expect(sizeIds.has(p.sizeId), `product ${p.id} has unknown sizeId ${p.sizeId}`);
  expect(p.onSale === (p.salePrice !== undefined), `product ${p.id} onSale/salePrice presence mismatch`);
  for (const attr of p.customAttributes) {
    expect(attributeIds.has(attr.attributeId), `product ${p.id} references unknown attributeId ${attr.attributeId}`);
  }
}

if (errors.length > 0) {
  console.error(`FAILED with ${errors.length} error(s):`);
  for (const e of errors) console.error(` - ${e}`);
  process.exit(1);
}

console.log(
  `OK: ${categories.length} categories, ${brands.length} brands, ${colors.length} colors, ${sizes.length} sizes, ${attributes.length} attributes, ${products.length} products all valid.`
);
