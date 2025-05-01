"use server";

import { getSession } from "@/lib/auth";
import { API_URL_LOCAL } from "@/lib/constants";
import { validateResponse } from "@/lib/validate-response";
import { Contract } from "@elearning/lib/models";

export async function updateContract(body: any) {
  const session = await getSession();

const url = `${API_URL_LOCAL}/contract/${body?.id}`;
    console.log("The url:  ", url);


  try {    
  const resp = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      Cookie: session.cookie,
      "Content-Type": "application/json",
    },
  });
    
   if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(`HTTP ${resp.status}: ${errorText}`);
    }     

    await validateResponse(resp);
  
      return true;
      } catch (error) {
    console.error("contract update failed:", error);
    throw error;
  }
}
