import { API_URL_LOCAL } from "@/lib/constants";
import { ContentRenderer } from "@elearning/block-editor";
import { EnrolledCourse, Lesson } from "@elearning/lib/models";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Separator,
} from "@elearning/ui";
import { Metadata, ResolvingMetadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cache } from "react";
import EnrollCourseButton from "../../enroll-course-button";

interface Props {
  params: { course: string; lesson: string };
}

const getLesson = cache(async (slug: string) => {
  const url = `${API_URL_LOCAL}/content/lessons/${slug}/trial`;

  const resp = await fetch(url, {
    cache: "no-store",
  });

  if (resp.status === 204) {
    return undefined;
  }

  return resp
    .json()
    .then((json) => json as Lesson)
    .catch((e) => undefined);
});

const getEnrolledCourse = async (courseId: number) => {
  const cookieStore = cookies();

  if (!cookieStore.has("access_token")) {
    return undefined;
  }

  const url = `${API_URL_LOCAL}/enrollments/${courseId}`;

  const resp = await fetch(url, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  if (!resp.ok) {
    return undefined;
  }

  return resp
    .json()
    .then((json) => json as EnrolledCourse)
    .catch(() => undefined);
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const lesson = await getLesson(params.lesson);

    const course = lesson?.chapter?.course;

    const previousImages = (await parent).openGraph?.images || [];

    if (course) {
      return {
        title: lesson.title,
        description: course.title,
        openGraph: {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${course.slug}/${lesson.slug}`,
          title: lesson.title,
          description: course.title,
          images: [`${course.cover ?? ""}`, ...previousImages],
          type: "website",
        },
        twitter: {
          title: lesson.title,
          description: course.title,
          card: "summary_large_image",
          images: [`${course.cover ?? ""}`, ...previousImages],
        },
      };
    }
  } catch (error) {}

  return {
    title: "Lesson not found",
  };
}

export default async function LessonDetail({ params }: Props) {
  const lesson = await getLesson(params.lesson);

  if (!lesson) {
    redirect(`/courses/${params.course}`);
  }

  if (!lesson.trial) {
    redirect(`/courses/${params.course}`);
  }

  const enrolledCourse = await getEnrolledCourse(
    lesson.chapter?.course?.id ?? 0
  );

  return (
    <div className="container max-w-3xl 2xl:max-w-4xl py-6">
      <h2 className="mb-1">{lesson.chapter?.course?.title}</h2>
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/courses/${lesson.chapter?.course?.slug}`}>
                {lesson.chapter?.course?.title}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{lesson.chapter?.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="aspect-w-16 aspect-h-9 mb-6">
        <Image
          src={lesson.chapter?.course?.cover ?? "/images/placeholder.jpeg"}
          className="object-cover rounded-md border"
          alt="Cover"
          fill
          sizes="100vh"
          priority
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3>{lesson.title}</h3>

        {enrolledCourse ? (
          <Button variant='teal' asChild>
            {enrolledCourse.resumeLesson?.slug ? (
              <Link
                href={`/learn/${enrolledCourse.course.slug}/lessons/${enrolledCourse.resumeLesson.slug}`}
              >
                Resume course
              </Link>
            ) : (
              <Link href={`/learn/${lesson.chapter?.course?.slug}`}>
                Resume course
              </Link>
            )}
          </Button>
        ) : (
          <EnrollCourseButton
            course={lesson.chapter?.course}
            revalidate={`/courses/${params.course}/lessons/${params.lesson}`}
          >
            Enroll course
          </EnrollCourseButton>
        )}
      </div>
      <Separator className="mt-4 mb-8" />
      <ContentRenderer html={lesson.html} />
      <div className="h-16"></div>
    </div>
  );
}
