import { API_URL_LOCAL } from "@/lib/constants";
import { Alert, Card, CardContent } from "@elearning/ui";
import { Category, Page } from "@elearning/lib/models";
import { buildQueryParams, pluralize } from "@elearning/lib/utils";
import { CategoryGridItem } from "@/components/category";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Categories",
  description: process.env.NEXT_PUBLIC_APP_DESC,
};

const getCategories = async () => {
  const query = buildQueryParams({
    includeCourseCount: true,
  });
  const url = `${API_URL_LOCAL}/content/categories${query}`;

  const resp = await fetch(url);

  return resp
    .json()
    .then((json) => json as Page<Category>)
    .catch((e) => undefined);
};

export default async function Categories() {
  const data = await getCategories();
  const [categories] = await Promise.all([data]);

  const categoriesUI = (list: Category[]) => {
    if (list.length === 0) {
      return <p className="text-muted-foreground mb-5">No content found</p>;
    }

    return list.map((c) => {
      return (
        <Link key={c.id} href={`/categories/${c.slug}`}>          
          <CategoryGridItem key={c.id} data={c} />          
        </Link>
        )
    })
  }

  return (
    <div className="mb-5">
      <div className="bg-teal-50p dark:bg-muted/70 mb-4">
        <div className="container h-[8rem]">
          <div className="flex items-center h-full">
            <h2 className="text-primary-foreground dark:text-foreground">Explore categories</h2>
          </div>
        </div>
      </div>
      <div className="container py-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoriesUI(categories?.contents ?? [])}
        </div>
      </div>
    </div>
  );
}
