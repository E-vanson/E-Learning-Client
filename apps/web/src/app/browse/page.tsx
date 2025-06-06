import { CourseGridItem } from "@/components/course";
import { API_URL_LOCAL } from "@/lib/constants";
import { Alert, Pagination } from "@elearning/ui";
import { Category, Course, Page } from "@elearning/lib/models";
import { buildQueryParams } from "@elearning/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import BrowseBreadcrumb from "./browse-breadcrumb";
import { CourseFilter } from "./course-filter";
import FilteredParams from "./filtered-params";

interface Props {
  searchParams: { [key: string]: string | undefined };
}

export const metadata: Metadata = {
  title: "Browse Courses",
  description: process.env.NEXT_PUBLIC_APP_DESC,
};

const getCourses = async (props: Props) => {
  const query = buildQueryParams({ ...props.searchParams, limit: 15 });

  const url = `${API_URL_LOCAL}/content/courses${query}`;

  const resp = await fetch(url, {
    cache: "no-store",
  });

  return resp
    .json()
    .then((json) => json as Page<Course>)
    .catch((e) => undefined);
};

const getCategories = async () => {
  const query = buildQueryParams({
    includeCourseCount: true,
  });
  const url = `${API_URL_LOCAL}/content/categories${query}`;

  const resp = await fetch(url, {
    next: { revalidate: 10 },
  });

  return resp
    .json()
    .then((json) => json as Page<Category>)
    .catch((e) => undefined);
};

export default async function BrowseCourses(props: Props) {
  const coursesPromise = getCourses(props);
  const categoriesPromise = getCategories();

  const [courses, categories] = await Promise.all([
    coursesPromise,
    categoriesPromise,
  ]);

  const content = () => {
    if (!courses?.contents.length) {
      return <Alert>No courses found</Alert>;
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.contents.map((c) => {
            return <CourseGridItem key={c.id} data={c} />;
          })}
        </div>

        <div className="flex justify-center lg:justify-end mt-10 xl:mt-8">
          <Pagination
            totalPage={courses?.totalPage ?? 0}
            currentPage={courses?.currentPage ?? 0}
            search={buildQueryParams(props.searchParams)}
            LinkComponent={Link}
          />
        </div>
      </>
    );
  };

  return (
    <>
      <div className="bg-teal dark:bg-muted/70 h-[5rem]">
        <div className="container h-full flex items-center">
          <BrowseBreadcrumb />
        </div>
      </div>
      <div className="container py-5 mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1">
            <CourseFilter categories={categories?.contents ?? []} />
          </div>
          <div className="lg:col-span-3">
            <FilteredParams className="mb-4" />
            {content()}
          </div>
        </div>
      </div>
    </>
  );
}
