import Image from "next/image";
import Link from "next/link";
import { getBrandById } from "@/shared/services/brands";
import type { Product } from "@/shared/types/product";
import styles from "./ProductCard.module.css";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const brand = getBrandById(product.brandId);

  return (
    <Link href={`/product/${product.slug}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src="/product-placeholder.svg"
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className={styles.image}
        />
      </div>
      {brand ? <span className={styles.brand}>{brand.name}</span> : null}
      <span className={styles.name}>{product.name}</span>
      <span className={styles.price}>
        {product.onSale ? (
          <>
            <span className={styles.priceSale}>${product.salePrice}</span>
            <span className={styles.priceStrikethrough}>${product.price}</span>
          </>
        ) : (
          <span className={styles.priceRegular}>${product.price}</span>
        )}
      </span>
      <span className={styles.stock}>
        <span
          className={product.inStock ? styles.stockDotInStock : styles.stockDotOutOfStock}
          aria-hidden="true"
        />
        {product.inStock ? "In stock" : "Out of stock"}
      </span>
    </Link>
  );
}
