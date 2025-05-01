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
import { JobStatus, Page, Job, ProposalStatus, Proposal, Contract, ContractStatus } from "@elearning/lib/models";
import {
  buildQueryParams,
  formatAbbreviate,
  formatRelativeTimestamp,
} from "@elearning/lib/utils";
import { cookies } from "next/headers";
import Link from "next/link";
import ContractActionButtons from "./contract-action-buttons";
import { ContractsFilter } from "./contract-filter";

interface ContractJobProps {
  searchParams: { [key: string]: string | undefined };
}

const getContracts = async ({ searchParams }: ContractJobProps) => {
  const query = buildQueryParams({ ...searchParams, limit: 10 });

  const url = `${API_URL_LOCAL}/contract`;

  const resp = await fetch(url, {      
    headers: {        
      Cookie: cookies().toString(),
    },
  });
  console.log("The jobs", resp);

  await validateResponse(resp);

  return (await resp.json()) as Page<Contract>;
};

export default async function EmployerContractsTable({ searchParams }: ContractJobProps) {
  const data = await getContracts({ searchParams });
  console.log("The contracts: ", )  

  const statusView = (status: ContractStatus) => {
    if (status === "active") {
      return (
        <span className="text-teal font-medium text-sm">Active</span>
      );
    } else if (status === 'draft') {
        return (
        <span className="text-muted-foreground font-medium text-sm">draft</span>
      );
    } else if (status === 'completed') {
        return (
        <span className="text-teal font-medium text-sm">completed</span>
      );
    }                 
    return <span className="text-destructive font-medium text-sm">Terminated</span>;
  };

  return (
    <>
      <div className="flex justify-between mb-4">
        <h2>Job Contracts</h2>
        <div>
          <ContractsFilter/>
        </div>
        
      </div>      
      <Table>
        {data.contents.length === 0 && (
          <TableCaption className="text-start">No Conracts Found</TableCaption>
        )}
        <TableHeader>
          <TableRow>
            <TableHead className="uppercase min-w-[300px] w-full">
              Contracts
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
                    <h6 className="mb-0.5">{p.terms.scopeOfWork ?? "(Untitled)"}</h6>
                    <span className="text-muted-foreground text-sm mb-2">
                      By&nbsp;{p.freelancer?.overview}                            
                    </span>  
                    <span className="text-muted-foreground text-sm mb-2">
                       Created on &nbsp;-&nbsp;
                      {formatRelativeTimestamp(p.audit?.createdAt)}
                    </span>
                  </div>
                </TableCell>
                <span className="text-muted-foreground text-sm mb-2">
                  {statusView(p?.status)}
                </span>
                <TableCell>
                  <ContractActionButtons contract={p} />
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
