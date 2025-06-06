import { API_URL_LOCAL } from "@/lib/constants";
import { validateResponse } from "@/lib/validate-response";
import {
  Pagination,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@elearning/ui";
import { Page, Post, PostStatus } from "@elearning/lib/models";
import {
  buildQueryParams,
  formatAbbreviate,
  formatRelativeTimestamp,
} from "@elearning/lib/utils";
import { cookies } from "next/headers";
import Link from "next/link";
import PostActionButtons from "./post-action-buttons";
import PostCreateButton from "./post-create-button";
import PostsFilter from "./posts-filter";

interface Props {
  searchParams: { [key: string]: string | undefined };
}

const getPosts = async ({ searchParams }: Props) => {
  const query = buildQueryParams({ ...searchParams, limit: 10 });

  const url = `${API_URL_LOCAL}/admin/posts${query}`;

  const resp = await fetch(url, {
    headers: {
      Cookie: cookies().toString(),
    },
  });

  await validateResponse(resp);

  return (await resp.json()) as Page<Post>;
};

export default async function Posts(props: Props) {
  const data = await getPosts(props);

  const statusView = (status: PostStatus) => {
    if (status === "draft") {
      return (
        <span className="text-muted-foreground font-medium text-sm">Draft</span>
      );
    }

    return <span className="text-teal font-medium text-sm">Published</span>;
  };

  return (
    <>
      <div className="flex justify-between mb-4">
        <h2>Posts</h2>
        <PostCreateButton />
      </div>
      <PostsFilter />
      <Table>
        {data.contents.length === 0 && (
          <TableCaption className="text-start">No posts found</TableCaption>
        )}
        <TableHeader>
          <TableRow>
            <TableHead className="uppercase min-w-[300px] w-full">
              Post
            </TableHead>
            <TableHead className="uppercase min-w-[150px]">Views</TableHead>
            <TableHead className="uppercase min-w-[150px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="border-b">
          {data.contents.map((p, i) => {
            return (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <h6 className="mb-0.5">{p.title ?? "(Untitled)"}</h6>
                    <span className="text-muted-foreground text-sm mb-2">
                      By&nbsp;{p.authors?.map((u) => u.nickname).join(", ")}
                      &nbsp;-&nbsp;
                      {formatRelativeTimestamp(p.audit?.createdAt)}
                    </span>
                    {statusView(p.status)}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatAbbreviate(BigInt(p.meta?.viewCount ?? 0))}
                </TableCell>
                <TableCell>
                  <PostActionButtons post={p} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="mt-8 flex justify-end">
        <Pagination
          totalPage={data.totalPage}
          currentPage={data.currentPage}
          search={buildQueryParams(props.searchParams)}
          LinkComponent={Link}
        />
      </div>
    </>
  );
}
