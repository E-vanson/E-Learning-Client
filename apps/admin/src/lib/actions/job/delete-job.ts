"use server";

import { getSession } from "@/lib/auth";
import { API_URL_LOCAL } from "@/lib/constants";
import { validateResponse } from "@/lib/validate-response";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteJob(id: number, needRedirect?: boolean) {
  const session = await getSession();

  const url = `${API_URL_LOCAL}/admin/jobs/${id}`;

  const resp = await fetch(url, {
    method: "DELETE",
    headers: {
      Cookie: session.cookie,
    },
  });

  await validateResponse(resp);

  revalidatePath("/admin/jobs");

  if (needRedirect) {
    redirect("/admin/jobs");
  }
}
