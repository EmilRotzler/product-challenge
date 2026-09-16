import Link from "next/link";
import { getPaginationRange } from "../../utils/paginate";
import styles from "./Pagination.module.css";

type PaginationProps = {
  slug: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  extraQuery?: string;
};

function buildHref(slug: string, page: number, extraQuery?: string): string {
  const params = new URLSearchParams(extraQuery);
  params.set("page", String(page));
  return `/categories/${slug}?${params.toString()}`;
}

export function Pagination({
  slug,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  extraQuery,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const rangeStart = (currentPage - 1) * itemsPerPage + 1;
  const rangeEnd = Math.min(currentPage * itemsPerPage, totalItems);
  const pages = getPaginationRange(currentPage, totalPages);

  return (
    <div className={styles.wrapper}>
      <p className={styles.status}>
        {rangeStart}–{rangeEnd} of {totalItems} products
      </p>
      <nav aria-label="Pagination" className={styles.nav}>
        <ArrowLink
          slug={slug}
          page={1}
          disabled={currentPage === 1}
          label="First page"
          symbol="«"
          extraQuery={extraQuery}
        />
        <ArrowLink
          slug={slug}
          page={currentPage - 1}
          disabled={currentPage === 1}
          label="Previous page"
          symbol="‹"
          extraQuery={extraQuery}
        />
        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className={styles.ellipsis} aria-hidden="true">
              …
            </span>
          ) : (
            <Link
              key={page}
              href={buildHref(slug, page, extraQuery)}
              className={page === currentPage ? styles.linkActive : styles.link}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </Link>
          ),
        )}
        <ArrowLink
          slug={slug}
          page={currentPage + 1}
          disabled={currentPage === totalPages}
          label="Next page"
          symbol="›"
          extraQuery={extraQuery}
        />
        <ArrowLink
          slug={slug}
          page={totalPages}
          disabled={currentPage === totalPages}
          label="Last page"
          symbol="»"
          extraQuery={extraQuery}
        />
      </nav>
    </div>
  );
}

type ArrowLinkProps = {
  slug: string;
  page: number;
  disabled: boolean;
  label: string;
  symbol: string;
  extraQuery?: string;
};

function ArrowLink({ slug, page, disabled, label, symbol, extraQuery }: ArrowLinkProps) {
  if (disabled) {
    return (
      <span aria-hidden="true" className={styles.arrowDisabled}>
        {symbol}
      </span>
    );
  }

  return (
    <Link href={buildHref(slug, page, extraQuery)} aria-label={label} className={styles.arrow}>
      {symbol}
    </Link>
  );
}
