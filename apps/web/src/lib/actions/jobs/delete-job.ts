"use server";

import { getSession } from "@/lib/auth";
import { API_URL_LOCAL } from "@/lib/constants";
import { validateResponse } from "@/lib/validate-response";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteJob(id: number) {
  const session = await getSession();

  const url = `${API_URL_LOCAL}/employer/jobs/${id}`;

  const resp = await fetch(url, {
    method: "DELETE",
    headers: {
      Cookie: session.cookie,
    },
  });

  await validateResponse(resp);  
  if (!resp) return false;

  revalidatePath("/employer/jobs");

  return true;
}
