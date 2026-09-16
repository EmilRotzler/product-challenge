import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "..", "data");

// Seeded PRNG (mulberry32) so re-running this script reproduces identical output.
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(42);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const randInt = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// --- Categories (flat array, nesting via parentId). Integer ids: these files
// are expected to be ported to a real DB later, where ids become primary keys. ---
const CAT_SMALL = 1;
const CAT_LARGE = 2;
const CAT_CUSTOM = 3;
const CAT_CUSTOM_SUB = 4;
const categories = [
  { id: CAT_SMALL, name: "Stationery", slug: "stationery", parentId: null },
  { id: CAT_LARGE, name: "Electronics", slug: "electronics", parentId: null },
  { id: CAT_CUSTOM, name: "Furniture", slug: "furniture", parentId: null },
  { id: CAT_CUSTOM_SUB, name: "Office Chairs", slug: "office-chairs", parentId: CAT_CUSTOM },
];

// --- Brands ---
const brandNames = ["Acme", "Northwind", "Globex", "Initech", "Umbrella", "Stark", "Wayne", "Hooli", "Soylent", "Wonka"];
const brands = brandNames.map((name, i) => ({ id: i + 1, name }));

// --- Colors ---
const colorNames = ["Black", "White", "Red", "Blue", "Green", "Yellow", "Gray", "Beige"];
const colors = colorNames.map((name, i) => ({ id: i + 1, name }));

// --- Sizes ---
const sizeNames = ["XS", "S", "M", "L", "XL", "XXL"];
const sizes = sizeNames.map((name, i) => ({ id: i + 1, name }));

// --- Custom attribute definitions (CMS-style extra fields) ---
const ATTR_MATERIAL = 1;
const ATTR_WEIGHT_KG = 2;
const ATTR_ASSEMBLY_REQUIRED = 3;
const ATTR_FINISH = 4;
const attributes = [
  { id: ATTR_MATERIAL, name: "Material", type: "text" },
  { id: ATTR_WEIGHT_KG, name: "Weight (kg)", type: "number" },
  { id: ATTR_ASSEMBLY_REQUIRED, name: "Assembly Required", type: "boolean" },
  { id: ATTR_FINISH, name: "Finish", type: "select", options: ["Matte", "Glossy", "Satin"] },
];

let nextProductId = 1;
function randomProductBase(name, categoryId) {
  const price = randInt(5, 500);
  const onSale = rand() < 0.2;
  const brand = pick(brands);
  const color = pick(colors);
  const size = pick(sizes);
  const id = nextProductId++;
  return {
    id,
    name,
    slug: `${slugify(name)}-${id}`,
    categoryId,
    price,
    onSale,
    ...(onSale ? { salePrice: Math.max(1, Math.round(price * 0.8)) } : {}),
    inStock: rand() < 0.85,
    brandId: brand.id,
    colorId: color.id,
    sizeId: size.id,
    customAttributes: [],
  };
}

function withCustomAttributes(product) {
  const materialOptions = ["Oak", "Walnut", "Steel", "Mesh", "Leather", "Plastic"];
  product.customAttributes = [
    { attributeId: ATTR_MATERIAL, value: pick(materialOptions) },
    { attributeId: ATTR_WEIGHT_KG, value: randInt(2, 40) },
    { attributeId: ATTR_ASSEMBLY_REQUIRED, value: rand() < 0.7 },
  ];
  if (rand() < 0.5) {
    product.customAttributes.push({ attributeId: ATTR_FINISH, value: pick(["Matte", "Glossy", "Satin"]) });
  }
  return product;
}

// --- Small category (cat-small): exercises a small-list UI, ~6 products ---
const stationeryNames = ["Notebook", "Pen Set", "Desk Organizer", "Sticky Notes Pack", "Highlighter Set", "Weekly Planner"];
const smallProducts = stationeryNames.map((name) => randomProductBase(name, CAT_SMALL));

// --- Large category (cat-large): exercises a large-list scenario, 1000 products ---
const electronicsTemplates = [
  "Wireless Headphones", "Bluetooth Speaker", "USB-C Cable", "Laptop Stand", "Mechanical Keyboard",
  "Wireless Mouse", "Smartwatch", "Portable Charger", "Webcam", "Noise Cancelling Earbuds",
  "HDMI Adapter", "Monitor Arm", "Desk Lamp", "Router", "External SSD",
  "Graphics Tablet", "Microphone", "Ring Light", "Power Strip", "Docking Station",
];
const largeProducts = [];
for (let i = 1; i <= 1000; i++) {
  const name = `${pick(electronicsTemplates)} ${i}`;
  largeProducts.push(randomProductBase(name, CAT_LARGE));
}

// --- Custom-attributes category (cat-custom + cat-custom-sub): exercises CMS extra fields ---
const furnitureNames = ["Oak Bookshelf", "Standing Desk", "Coffee Table", "TV Stand", "Bar Stool", "Bed Frame"];
const officeChairNames = ["Ergonomic Mesh Chair", "Executive Leather Chair", "Drafting Stool", "Kneeling Chair", "Gaming Chair", "Task Chair"];
const furnitureProducts = furnitureNames.map((name) => withCustomAttributes(randomProductBase(name, CAT_CUSTOM)));
const officeChairProducts = officeChairNames.map((name) => withCustomAttributes(randomProductBase(name, CAT_CUSTOM_SUB)));

const products = [...smallProducts, ...largeProducts, ...furnitureProducts, ...officeChairProducts];

function writeJson(filename, data) {
  writeFileSync(path.join(dataDir, filename), JSON.stringify(data, null, 2) + "\n");
}

mkdirSync(dataDir, { recursive: true });
writeJson("categories.json", categories);
writeJson("brands.json", brands);
writeJson("colors.json", colors);
writeJson("sizes.json", sizes);
writeJson("attributes.json", attributes);
writeJson("products.json", products);

console.log(
  `Wrote ${categories.length} categories, ${brands.length} brands, ${colors.length} colors, ${sizes.length} sizes, ${attributes.length} attributes, ${products.length} products to ${dataDir}`
);
