"use server";

import { getSession } from "@/lib/auth";
import { API_URL_LOCAL } from "@/lib/constants";
import { validateResponse } from "@/lib/validate-response";

export async function getJobData(slug: string) { 
  console.log("Getting the jobData:")
  const url = `${API_URL_LOCAL}/content/jobs/${slug}`;

  const resp = await fetch(url, {
    method: "GET",    
    cache: "no-store", // optional, but likely wanted for fresh data
  });
    // console.log("the response json: ", await resp.json());  

  await validateResponse(resp);

  const data = await resp.json();
  return data;
}
