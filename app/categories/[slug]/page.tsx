import { CategoryPage } from "@/features/categories";

export default async function Page(props: PageProps<"/categories/[slug]">) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;
  const page = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;

  return <CategoryPage slug={slug} page={page} searchParams={searchParams} />;
}
