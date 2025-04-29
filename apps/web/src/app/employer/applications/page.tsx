// "use client"

import { API_URL_LOCAL } from "@/lib/constants";
import { validateResponse } from "@/lib/validate-response";
import { EmployerDashboardSummary, EmployerProposalsSummary } from "@elearning/lib/models";
import { formatAbbreviate } from "@elearning/lib/utils";
import { Card, CardContent, CardFooter, Separator } from "@elearning/ui";
import { DollarSign, Edit, GraduationCap, UsersIcon, BriefcaseBusiness } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import EmployerProposals from "./applications";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Applications",
  description: process.env.NEXT_PUBLIC_APP_DESC
}

const getData = async () => {
  const url = `${API_URL_LOCAL}/employer/dashboard/summary`;

  const resp = await fetch(url, {
    headers: {
      Cookie: cookies().toString(),
    },
  });

  console.log("The response: ", resp);

  await validateResponse(resp);

  return (await resp.json()) as EmployerProposalsSummary;
};

export default async function EmployerApplications({ searchParams}: {searchParams: { [key: string]: string | undefined };}) {
  
  const data = await getData();

  return (
    <>          
      <div className="ml-6">
        <EmployerProposals searchParams={searchParams} />        
      </div>
        
    </>
  );
}
