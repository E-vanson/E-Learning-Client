import { API_URL_LOCAL } from "@/lib/constants";
import { validateResponse } from "@/lib/validate-response";
import { Page, Proposal, ProposalStatus } from "@elearning/lib/models";
import { buildQueryParams, formatRelativeTimestamp } from "@elearning/lib/utils";
import { Link } from "lucide-react";
import { cookies } from "next/headers";
import { ProposalFilter } from "./proposals-filter";
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
import ProposalActionButtons from "./proposal-action-buttons";

interface FreelancerProposalProps {
  searchParams: { [key: string]: string | undefined };
}

const getProposals = async ({ searchParams }: FreelancerProposalProps) => {
  const query = buildQueryParams({ ...searchParams, limit: 10 });
  const url = `${API_URL_LOCAL}/freelancer/dashboard/proposals${query}`;

  const resp = await fetch(url, {
    headers: {
      Cookie: cookies().toString()
    }
  })
  console.log("The Proposals: ", resp);

  await validateResponse(resp);

  return (await resp.json()) as Page<Proposal>;
}

export default async function FreelancerProposals({ searchParams }: FreelancerProposalProps) {
  const data = await getProposals({ searchParams });
  console.log("The freelancer proposals: ", data);

  const statusView =  (status: ProposalStatus) => {
      if (status === "pending") {
        return (
          <span className="text-muted-foreground font-medium text-sm">Draft</span>
        );
      } else if (status === 'accepted') {
          return (
          <span className="text-teal font-medium text-sm">Accepted</span>
        );
      }            
      return <span className="text-destructive font-medium text-sm">Rejected</span>;
  };
  
  return (
     <>
      <div className="flex justify-between mb-4">
        <h2>Proposals</h2>
        <div className="flex">
          <ProposalFilter/>
        </div>
        
      </div>      
      <Table>
        {data.contents.length === 0 && (
          <TableCaption className="text-start">No Proposals Found</TableCaption>
        )}
        <TableHeader>
          <TableRow>
            <TableHead className="uppercase min-w-[300px] w-full">
              Proposal
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
                    <h6 className="mb-0.5">{p.job.title ?? "(Untitled)"}</h6>
                    <span className="text-muted-foreground text-sm mb-2">
                      By&nbsp;{p.freelancer?.overview}      
                       &nbsp;-&nbsp;
                      {formatRelativeTimestamp(p.audit?.createdAt)}
                    </span>                   
                  </div>
                </TableCell>
                <span className="text-muted-foreground text-sm mb-0.5">
                  {statusView(p?.status)}
                </span>
                <TableCell>
                  <ProposalActionButtons proposal={p} />
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
  )
}