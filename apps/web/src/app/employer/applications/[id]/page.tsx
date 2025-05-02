import { API_URL_LOCAL } from "@/lib/constants";
import { validateResponse } from "@/lib/validate-response";
import { Contract, Job, Proposal } from "@elearning/lib/models";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import ProposalViewPage from "./view-application";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employer Proposal",
  description: process.env.NEXT_PUBLIC_APP_DESC,
};

const getProposal = async (id: string) => {
    console.log("Getting one proposal");
  try {
    const url = `${API_URL_LOCAL}/proposals/employer/${id}`;
    console.log("Fetching job from:", url);

    const resp = await fetch(url, {
      headers: {
        Cookie: cookies().toString(),
      },
    });
    console.log("Response status:", resp.status);

    await validateResponse(resp);

    const data = await resp.json();
    console.log("Contract data received:", data);
    return data as Proposal;
  } catch (error) {
    console.error("Error fetching contract:", error);
    return undefined;
  }
};

export default async function ContractEdit({ params }: { params: { id: string } }) {
  const proposal = await getProposal(params.id);
  console.log(proposal, "The proposalll...");

  if (!proposal) {
    notFound();
  }

  // const authorPage = getAuthors();
  // const tagPage = getTags();

  // const [authors, tags] = await Promise.all([authorPage, tagPage]);

  return <ProposalViewPage proposal={proposal}/>
}
