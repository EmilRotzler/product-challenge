import { notFound } from "next/navigation";
import {
  getCategoryAncestors,
  getCategoryAndDescendantIds,
  getCategoryBySlug,
  getChildCategories,
} from "@/shared/services/categories";
import { getProductsByCategoryIds } from "@/shared/services/products";
import { getAllBrands } from "@/shared/services/brands";
import { getAllColors } from "@/shared/services/colors";
import { getAllSizes } from "@/shared/services/sizes";
import { getAllAttributes } from "@/shared/services/attributes";
import { ProductGrid } from "@/shared/components/ProductGrid";
import {
  Toolbar,
  parseFilterState,
  serializeFilterState,
  hasActiveFilters,
  buildRelevantSeed,
  filterProducts,
  sortProducts,
  getFilterOptions,
  type SearchParams,
} from "@/features/filtering-and-sorting";
import { PRODUCTS_PER_PAGE, paginate } from "../../utils/paginate";
import { Breadcrumbs } from "../Breadcrumbs";
import { Pagination } from "../Pagination";
import { SubcategoryLinks } from "../SubcategoryLinks";
import styles from "./CategoryPage.module.css";

type CategoryPageProps = {
  slug: string;
  page?: string;
  searchParams: SearchParams;
};

export function CategoryPage({ slug, page, searchParams }: CategoryPageProps) {
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const ancestors = getCategoryAncestors(category.id);
  const childCategories = getChildCategories(category.id);
  const categoryIds = getCategoryAndDescendantIds(category.id);
  const allProducts = getProductsByCategoryIds(categoryIds);

  const allAttributes = getAllAttributes();
  const filterState = parseFilterState(searchParams, allAttributes);
  const filterOptions = getFilterOptions(allProducts, getAllBrands(), getAllColors(), getAllSizes(), allAttributes);

  const filteredProducts = filterProducts(allProducts, filterState);
  const seed = buildRelevantSeed(slug, filterState);
  const sortedProducts = sortProducts(filteredProducts, filterState.sort, seed);

  const requestedPage = Number.parseInt(page ?? "1", 10);
  const { items, currentPage, totalPages, totalItems } = paginate(
    sortedProducts,
    Number.isNaN(requestedPage) ? 1 : requestedPage,
  );

  const emptyMessage = hasActiveFilters(filterState)
    ? "No products match your filters."
    : "No products in this category yet.";

  return (
    <main className={styles.main}>
      <Breadcrumbs ancestors={ancestors} current={category} />
      <h1 className={styles.heading}>{category.name}</h1>
      <SubcategoryLinks categories={childCategories} />
      <Toolbar slug={slug} filterState={filterState} filterOptions={filterOptions} />
      <div className={styles.gridBleed}>
        <ProductGrid products={items} emptyMessage={emptyMessage} />
      </div>
      <Pagination
        slug={slug}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={PRODUCTS_PER_PAGE}
        extraQuery={serializeFilterState(filterState)}
      />
    </main>
  );
}
