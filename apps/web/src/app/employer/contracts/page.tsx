import { API_URL_LOCAL } from "@/lib/constants";
import { validateResponse } from "@/lib/validate-response";
import { Contract, EmployerDashboardSummary, EmployerProposalsSummary } from "@elearning/lib/models";
import { formatAbbreviate } from "@elearning/lib/utils";
import { Card, CardContent, CardFooter, Separator } from "@elearning/ui";
import { DollarSign, Edit, GraduationCap, UsersIcon, BriefcaseBusiness } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import EmployerContractsTable from "./contracts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Applications",
  description: process.env.NEXT_PUBLIC_APP_DESC
}

const getData = async () => {
  const url = `${API_URL_LOCAL}/contract`;

  const resp = await fetch(url, {
    headers: {
      Cookie: cookies().toString(),
    },
  });

  console.log("The response: ", resp);

  await validateResponse(resp);

  return (await resp.json()) as Contract[];
};

export default async function EmployerContracts({ searchParams}: {searchParams: { [key: string]: string | undefined };}) {
  
  const data = await getData();

  return (
    <>          
      <div className="ml-6">
        <EmployerContractsTable searchParams={searchParams} />        
      </div>
        
    </>
  );
}
