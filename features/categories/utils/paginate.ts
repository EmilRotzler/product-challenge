export const PRODUCTS_PER_PAGE = 100;

export type PaginationResult<T> = {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

export function paginate<T>(allItems: T[], requestedPage: number): PaginationResult<T> {
  const totalPages = Math.max(1, Math.ceil(allItems.length / PRODUCTS_PER_PAGE));
  const currentPage = Math.min(Math.max(1, requestedPage), totalPages);
  const start = (currentPage - 1) * PRODUCTS_PER_PAGE;

  return {
    items: allItems.slice(start, start + PRODUCTS_PER_PAGE),
    currentPage,
    totalPages,
    totalItems: allItems.length,
  };
}

export type PaginationRangeItem = number | "ellipsis";

export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
): PaginationRangeItem[] {
  const totalVisible = siblingCount * 2 + 5;

  if (totalPages <= totalVisible) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + siblingCount * 2;
    const leftRange = Array.from({ length: leftItemCount }, (_, index) => index + 1);
    return [...leftRange, "ellipsis", totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = 3 + siblingCount * 2;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, index) => totalPages - rightItemCount + index + 1,
    );
    return [1, "ellipsis", ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSibling - leftSibling + 1 },
    (_, index) => leftSibling + index,
  );
  return [1, "ellipsis", ...middleRange, "ellipsis", totalPages];
}
