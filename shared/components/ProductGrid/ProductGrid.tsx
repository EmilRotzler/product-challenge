import type { Product } from "@/shared/types/product";
import { ProductCard } from "@/shared/components/ProductCard/ProductCard";
import styles from "./ProductGrid.module.css";

type ProductGridProps = {
  products: Product[];
  emptyMessage?: string;
};

export function ProductGrid({ products, emptyMessage = "No products in this category yet." }: ProductGridProps) {
  if (products.length === 0) {
    return <p className={styles.empty}>{emptyMessage}</p>;
  }

  return (
    <ul className={styles.grid}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
