// "use client"

import { API_URL_LOCAL } from "@/lib/constants";
import { validateResponse } from "@/lib/validate-response";
import {
  Pagination,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@elearning/ui";
import { JobStatus, Page, Job } from "@elearning/lib/models";
import {
  buildQueryParams,
  formatAbbreviate,
  formatRelativeTimestamp,
} from "@elearning/lib/utils";
import { cookies } from "next/headers";
import Link from "next/link";
import JobActionButtons from "./job-action-buttons";
import { JobsFilter } from "./jobs-filter";

interface EmployerJobsProps {
  searchParams: { [key: string]: string | undefined };
}

const getJobs = async ({ searchParams }: EmployerJobsProps) => {
  const query = buildQueryParams({ ...searchParams, limit: 10 });

  const url = `${API_URL_LOCAL}/employer/dashboard/jobs${query}`;

  const resp = await fetch(url, {
    headers: {
      Cookie: cookies().toString(),
    },
  });
  console.log("The jobs", resp);

  await validateResponse(resp);

  return (await resp.json()) as Page<Job>;
};

export default async function EmployerJobs({ searchParams }: EmployerJobsProps) {
  const data = await getJobs({searchParams});
  console.log("The data: ", data);

  const statusView = (status: JobStatus) => {
    if (status === "draft") {
      return (
        <span className="text-muted-foreground font-medium text-sm">Draft</span>
      );
    } else if (status === 'active') {
        return (
        <span className="text-muted-foreground font-medium text-sm">Active</span>
      );
    }            
    return <span className="text-teal font-medium text-sm">Closed</span>;
  };

  return (
    <>
      <div className="flex justify-between mb-4">
        <h2>Jobs</h2>
        <div className="flex">
          <JobsFilter/>
        </div>
        
      </div>      
      <Table>
        {data.contents.length === 0 && (
          <TableCaption className="text-start">No jobs found</TableCaption>
        )}
        <TableHeader>
          <TableRow>
            <TableHead className="uppercase min-w-[300px] w-full">
              Job
            </TableHead>
            <TableHead className="uppercase min-w-[150px]">Status</TableHead>
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
                      By&nbsp;{p.employer.companyName}      
                       &nbsp;-&nbsp;
                      {formatRelativeTimestamp(p.audit?.createdAt)}
                    </span>                   
                  </div>
                </TableCell>
                <span className="text-muted-foreground text-sm mb-0.5">
                  {statusView(p?.status)}
                </span>
                <TableCell>
                  <JobActionButtons job={p} />
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
          search={buildQueryParams(searchParams.searchParams)}
          LinkComponent={Link}
        />
      </div>
    </>
  );
}
