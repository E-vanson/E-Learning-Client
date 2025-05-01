import { API_URL_LOCAL } from "@/lib/constants";
import { validateResponse } from "@/lib/validate-response";
import { Contract, Job } from "@elearning/lib/models";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import ContractEditPage from "./contract-edit-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employer Contracts",
  description: process.env.NEXT_PUBLIC_APP_DESC,
};

const getContract = async (id: string) => {
    console.log("Getting one contract");
  try {
    const url = `${API_URL_LOCAL}/contract/${id}`;
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
    return data as Contract;
  } catch (error) {
    console.error("Error fetching contract:", error);
    return undefined;
  }
};

export default async function ContractEdit({ params }: { params: { id: string } }) {
  const contract = await getContract(params.id);
  console.log(contract, "The contract...");

  if (!contract) {
    notFound();
  }

  // const authorPage = getAuthors();
  // const tagPage = getTags();

  // const [authors, tags] = await Promise.all([authorPage, tagPage]);

  return <ContractEditPage contract={contract} />;
}
