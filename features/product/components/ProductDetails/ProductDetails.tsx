import type { Product } from "@/shared/types/product";
import type { Brand } from "@/shared/types/brand";
import type { Color } from "@/shared/types/color";
import type { Size } from "@/shared/types/size";
import type { Attribute } from "@/shared/types/attribute";
import styles from "./ProductDetails.module.css";

type ResolvedCustomAttribute = {
  attribute: Attribute;
  value: string | number | boolean;
};

type ProductDetailsProps = {
  product: Product;
  brand: Brand | undefined;
  color: Color | undefined;
  size: Size | undefined;
  customAttributes: ResolvedCustomAttribute[];
};

function formatAttributeValue(value: string | number | boolean): string {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  return String(value);
}

export function ProductDetails({ product, brand, color, size, customAttributes }: ProductDetailsProps) {
  return (
    <div className={styles.details}>
      <h1 className={styles.name}>{product.name}</h1>
      <p className={styles.description}>{product.description}</p>
      <h2 className={styles.specsHeading}>Product Information</h2>
      <dl className={styles.specs}>
        {brand && (
          <div className={styles.specRow}>
            <dt className={styles.specLabel}>Brand</dt>
            <dd className={styles.specValue}>{brand.name}</dd>
          </div>
        )}
        {color && (
          <div className={styles.specRow}>
            <dt className={styles.specLabel}>Color</dt>
            <dd className={styles.specValue}>{color.name}</dd>
          </div>
        )}
        {size && (
          <div className={styles.specRow}>
            <dt className={styles.specLabel}>Size</dt>
            <dd className={styles.specValue}>{size.name}</dd>
          </div>
        )}
        {customAttributes.map(({ attribute, value }) => (
          <div key={attribute.id} className={styles.specRow}>
            <dt className={styles.specLabel}>{attribute.name}</dt>
            <dd className={styles.specValue}>{formatAttributeValue(value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
