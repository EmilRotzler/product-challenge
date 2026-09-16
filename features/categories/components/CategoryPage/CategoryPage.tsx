import { notFound } from "next/navigation";
import {
  getCategoryAncestors,
  getCategoryAndDescendantIds,
  getCategoryBySlug,
  getChildCategories,
} from "@/shared/services/categories";
import { getProductsByCategoryIds } from "@/shared/services/products";
import { ProductGrid } from "@/shared/components/ProductGrid";
import { PRODUCTS_PER_PAGE, paginate } from "../../utils/paginate";
import { Breadcrumbs } from "../Breadcrumbs";
import { Pagination } from "../Pagination";
import { SubcategoryLinks } from "../SubcategoryLinks";
import styles from "./CategoryPage.module.css";

type CategoryPageProps = {
  slug: string;
  page?: string;
};

export function CategoryPage({ slug, page }: CategoryPageProps) {
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const ancestors = getCategoryAncestors(category.id);
  const childCategories = getChildCategories(category.id);
  const categoryIds = getCategoryAndDescendantIds(category.id);
  const products = getProductsByCategoryIds(categoryIds);

  const requestedPage = Number.parseInt(page ?? "1", 10);
  const { items, currentPage, totalPages, totalItems } = paginate(
    products,
    Number.isNaN(requestedPage) ? 1 : requestedPage,
  );

  return (
    <main className={styles.main}>
      <Breadcrumbs ancestors={ancestors} current={category} />
      <h1 className={styles.heading}>{category.name}</h1>
      <SubcategoryLinks categories={childCategories} />
      <div className={styles.gridBleed}>
        <ProductGrid products={items} />
      </div>
      <Pagination
        slug={slug}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={PRODUCTS_PER_PAGE}
      />
    </main>
  );
}
