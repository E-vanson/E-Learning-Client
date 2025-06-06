import { API_URL_LOCAL } from "@/lib/constants";
import { Alert, Button, ProfileAvatar, ScrollToTop } from "@elearning/ui";
import { Post, User } from "@elearning/lib/models";
import {
  cn,
  formatAbbreviate,
  formatRelativeTimestamp,
  wordPerMinute,
} from "@elearning/lib/utils";
import { LockKeyhole } from "lucide-react";
import { Metadata, ResolvingMetadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { cache } from "react";
import { ContentRenderer } from "@elearning/block-editor"

interface Props {
  params: { slug: string };
}

const getPost = cache(async (slug: string) => {
  const url = `${API_URL_LOCAL}/content/posts/${slug}`;

  const resp = await fetch(url, {
    cache: "no-store",
  });

  if (!resp.ok || resp.status === 204) {
    return undefined;
  }

  return resp
    .json()
    .then((json) => json as Post)
    .catch((e) => undefined);
});

const getUser = async () => {
  const url = `${API_URL_LOCAL}/profile`;
  const resp = await fetch(url, {
    headers: {
      Cookie: cookies().toString(),
    },
    next: { revalidate: 10 },
  });

  return resp.ok ? ((await resp.json()) as User) : null;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await getPost(params.slug).catch((error) => {
    console.error("Error fetching post in generateMetadata:", error);
    return null;
  });

  const previousImages = (await parent).openGraph?.images || [];

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  const title = post.title ?? "(Untitled)";
  const desc = post.excerpt ?? title;
  
  return {
    title: title,
    description: desc,
    openGraph: {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${post.slug}`,
      title: title,
      description: desc,
      images: [
        post.cover ?? require("@/../../../packages/assets/images/placeholder.jpg"), 
        ...previousImages
      ],
      type: "website",
    },
    twitter: {
      title: title,
      description: desc,
      card: "summary_large_image",
      images: [
        post.cover ?? require("@/../../../packages/assets/images/placeholder.jpg"), 
        ...previousImages
      ],
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const postPromise = getPost(params.slug);
  const userPromise = getUser();

  const [post, user] = await Promise.all([postPromise, userPromise]);
  console.log("Finding the post: ", getPost(params.slug))

  if (!post) {
    return (
      <div className="container py-5">
        <Alert>Post not found</Alert>
      </div>
    );
  }

  const authorsView = () => {
    const authorCount = post.authors?.length ?? 0;

    return (
      <div
        className={cn(
          "flex items-center gap-3 mb-4",
          authorCount > 1 ? "-ml-[3px]" : undefined
        )}
      >
        <div className="flex flex-shrink-0">
          {post.authors?.map((a, i) => {
            return (
              <ProfileAvatar
                key={i}
                src={a.image}
                prefix={a.nickname.substring(0, 2)}
                className={cn(
                  "size-[54px]",
                  i > 0 ? "ml-[-27px]" : undefined,
                  authorCount > 1 ? "border-3 border-background" : undefined
                )}
                style={{
                  zIndex: authorCount - i,
                }}
              />
            );
          })}
        </div>
        <div className="flex flex-col">
          <span className="">
            By {post.authors?.map((a) => a.nickname).join(", ")}
          </span>
          <span className="text-sm text-muted-foreground">
            {formatRelativeTimestamp(post.publishedAt)}
          </span>
        </div>

        <div className="flex-grow"></div>
        {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="default" size="icon">
                <Share2 className="text-gray-600 size-5" />
              </Button>
            </TooltipTrigger>

            <TooltipContent>Share</TooltipContent>
          </Tooltip>
        </TooltipProvider> */}
      </div>
    );
  };

  const content = () => {
    if (post.visibility === "member" && !user) {
      return (
        <div className="rounded bg-teal dark:bg-muted px-5 py-8 flex flex-col items-center">
          <LockKeyhole className="text-primary-foreground dark:text-muted-foreground mb-2 size-7" />
          <p className="mb-4 text-primary-foreground dark:text-muted-foreground">
            You need to sign in to view this content.
          </p>
          <Button className="bg-white text-black hover:bg-gray-200" asChild>
            <Link href={`/login`}>Sign In</Link>
          </Button>
        </div>
      );
    }

    if (
      post.visibility === "paid_member" &&
      (!user || user.expiredAt < new Date().getTime())
    ) {
      return (
        <div className="rounded bg-primary dark:bg-muted px-5 py-8 flex flex-col items-center">
          <LockKeyhole className="text-primary-foreground dark:text-muted-foreground mb-2 size-7" />
          <p className="mb-4 text-primary-foreground dark:text-muted-foreground">
            You need to subscribe to view this content.
          </p>
          <Button className="bg-white hover:bg-gray-200 text-black" asChild>
            <Link href={`/pricing`}>Subscribe</Link>
          </Button>
        </div>
      );
    }

    return (
      <>
        <ContentRenderer html={post.html} />

        <div className="flex flex-wrap gap-2 mt-10">
          {post.tags?.map((t) => {
            return (
              <Link
                key={t.id}
                href={`/blogs/${t.slug}`}
                className="bg-muted text-foreground rounded-md text-sm px-3 py-2"
              >
                {t.name}
              </Link>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <>
      <ScrollToTop />
      <div className="container max-w-3xl 2xl:max-w-4xl py-5 mb-10">
        <h2 className="text-center">{post.title ?? "(Untitled)"}</h2>
        <div className="flex items-center justify-center mb-7 mt-2">
          <div className="text-muted-foreground">
            {wordPerMinute(post.wordCount)} min read
          </div>
          <div className="mx-2 text-muted-foreground">&bull;</div>
          <div className="text-muted-foreground">
            {formatAbbreviate(BigInt(post.meta?.viewCount ?? 0))} views
          </div>
        </div>

        {authorsView()}

        <div className="aspect-w-16 aspect-h-9 mb-7">
          <Image
            src={post.cover ?? require("@/../../../packages/assets/images/placeholder.jpg")}
            className="object-cover rounded-md border"
            alt="Cover"
            fill
            sizes="100vh"
            priority
          />
        </div>

        {content()}

        {/* <Separator className="mt-6 mb-4" />

      {authorsView()} */}
      </div>
    </>
  );
}
