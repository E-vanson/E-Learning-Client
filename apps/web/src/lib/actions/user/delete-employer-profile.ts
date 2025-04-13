"use server"

import { getSession } from "@/lib/auth";
import { API_URL_LOCAL } from "@/lib/constants";
import { validateResponse } from "@/lib/validate-response";
import { Freelancer, UserJobRole } from "@elearning/lib/models";
import { revalidatePath } from "next/cache";

export async function deleteEmployerProfile(id: string): Promise<boolean> {
  console.log("At the beginning of the request: ");
  const session = await getSession();
  const profileId = id;
  const url = `${API_URL_LOCAL}/employer/${profileId}`;

  const resp = await fetch(url, {
    method: "DELETE",
    headers: {
      Cookie: session.cookie,
    },
  });
  console.log("The employer delete data: ", resp);

  await validateResponse(resp);

  // Assume the response is a JSON encoded boolean
  const data: boolean = await resp.json();
  revalidatePath("/profile");
  return data;
}
