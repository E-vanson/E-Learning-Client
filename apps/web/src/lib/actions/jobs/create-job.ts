"use server";

import { getSession } from "@/lib/auth";
import { API_URL_LOCAL } from "@/lib/constants";
import { validateResponse } from "@/lib/validate-response";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createJob(body: any) {
  console.log("Reached to create job:", body)
  const session = await getSession();
  const url = `${API_URL_LOCAL}/employer/jobs`;

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

    const jobId = await resp.text();
    console.log("Received Job ID:", jobId);
    
    revalidatePath("/jobs");
    redirect(`/jobs`);
  } catch (error) {
    console.error("Job creation failed:", error);
    throw error;
  }
}