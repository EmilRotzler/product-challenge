import type { Product } from "@/shared/types/product";
import { ProductCard } from "@/shared/components/ProductCard";
import styles from "./ProductGrid.module.css";

type ProductGridProps = {
  products: Product[];
};

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return <p className={styles.empty}>No products in this category yet.</p>;
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
