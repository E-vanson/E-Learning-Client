"use server";

import { getSession } from "@/lib/auth";
import { API_URL_LOCAL } from "@/lib/constants";
import { validateResponse } from "@/lib/validate-response";
import { Post } from "@elearning/lib/models";

export async function updateJob(body: any) {
  const session = await getSession();

const url = `${API_URL_LOCAL}/admin/jobs/${body?.id}`;
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
 
    console.log("The job update response: ", resp);

  await validateResponse(resp);

  // revalidatePath(`/admin/posts/${body.id}`);

      return (await resp.json()) as Post;
      } catch (error) {
    console.error("Job creation failed:", error);
    throw error;
  }
}
