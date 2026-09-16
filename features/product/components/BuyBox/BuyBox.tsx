import type { Product } from "@/shared/types/product";
import styles from "./BuyBox.module.css";

type BuyBoxProps = {
  product: Product;
};

export function BuyBox({ product }: BuyBoxProps) {
  return (
    <div className={styles.box}>
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
      <button type="button" className={styles.addToCart}>
        Add to Cart
      </button>
      <div className={styles.delivery}>
        <p>Arrives in 3-5 business days</p>
        <p>Free returns within 30 days</p>
      </div>
    </div>
  );
}
