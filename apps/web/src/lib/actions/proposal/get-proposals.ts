"use server";

import { getSession } from "@/lib/auth";
import { API_URL_LOCAL } from "@/lib/constants";
import { validateResponse } from "@/lib/validate-response";
import { ApplicationJobProps, Page, Proposal, ProposalReview } from "@elearning/lib/models";
import { buildQueryParams } from "@elearning/lib/utils";

export const getProposalsData = async ( ) => {
    const session = await getSession();
//   const query = buildQueryParams({ ...searchParams, limit: 10 });

  const url = `${API_URL_LOCAL}/employer/dashboard/proposals`;

  const resp = await fetch(url, {
    headers: {
      Cookie: session.cookie,
    },
  });
  console.log("The jobs", resp);

  await validateResponse(resp);

  return (await resp.json()) as Page<Proposal>;
};
