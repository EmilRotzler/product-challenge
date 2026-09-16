import { ProductPage } from "@/features/product";

export default async function Page(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;

  return <ProductPage slug={slug} />;
}
