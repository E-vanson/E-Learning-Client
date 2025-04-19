"use server";

import { getSession } from "@/lib/auth";
import { API_URL_LOCAL } from "@/lib/constants";
import { validateResponse } from "@/lib/validate-response";
import { Proposal } from "@elearning/lib/models";
import { revalidatePath } from "next/cache";

export async function applyJob(jobId: string, body: Proposal, revalidate?: string) {
  const session = await getSession();
  console.log("Inside the apply job api call");
  const url = `${API_URL_LOCAL}/proposals/${jobId}`;

  try {
     const resp = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        Cookie: session.cookie,
        'Content-Type': 'application/json',
      },
    });

  if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(`HTTP ${resp.status}: ${errorText}`);
    }

  await validateResponse(resp);

  if (revalidate) {
    revalidatePath(revalidate);
  }
    return true;
  } catch (err) {
    console.error("Job Application Failed")
  }
}