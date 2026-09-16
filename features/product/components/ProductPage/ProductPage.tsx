import { notFound } from "next/navigation";
import { getCategoryAncestors, getCategoryById } from "@/shared/services/categories";
import { getProductBySlug } from "@/shared/services/products";
import { getBrandById } from "@/shared/services/brands";
import { getColorById } from "@/shared/services/colors";
import { getSizeById } from "@/shared/services/sizes";
import { getAttributeById } from "@/shared/services/attributes";
import { Breadcrumbs } from "@/features/categories";
import { ImageCarousel } from "../ImageCarousel";
import { ProductDetails } from "../ProductDetails";
import { BuyBox } from "../BuyBox";
import styles from "./ProductPage.module.css";

type ProductPageProps = {
  slug: string;
};

export function ProductPage({ slug }: ProductPageProps) {
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const category = getCategoryById(product.categoryId);
  const ancestors = category ? getCategoryAncestors(category.id) : [];
  const breadcrumbAncestors = category ? [...ancestors, category] : ancestors;

  const brand = getBrandById(product.brandId);
  const color = getColorById(product.colorId);
  const size = getSizeById(product.sizeId);
  const customAttributes = product.customAttributes.flatMap((entry) => {
    const attribute = getAttributeById(entry.attributeId);
    return attribute ? [{ attribute, value: entry.value }] : [];
  });

  return (
    <main className={styles.main}>
      <Breadcrumbs ancestors={breadcrumbAncestors} current={{ name: product.name }} />
      <div className={styles.layout}>
        <div className={styles.primary}>
          <ImageCarousel />
          <ProductDetails
            product={product}
            brand={brand}
            color={color}
            size={size}
            customAttributes={customAttributes}
          />
        </div>
        <div className={styles.secondary}>
          <BuyBox product={product} />
        </div>
      </div>
    </main>
  );
}
