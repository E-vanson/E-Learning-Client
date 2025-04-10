"use server"

import { getSession } from "@/lib/auth";
import { API_URL_LOCAL } from "@/lib/constants";
import { validateResponse } from "@/lib/validate-response";
import { UserJobRole } from "@elearning/lib/models";
import { revalidatePath } from "next/cache";

export async function updateUserFreelancerProfile(body: object) {
    const session = await getSession();
    
    const url = `${API_URL_LOCAL}/freelancer`;

    const resp = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
        Cookie: session.cookie,
        "Content-Type": "application/json",
    },
    });

    await validateResponse(resp);

    const data = await resp.json();
    revalidatePath("/profile");
    return data;
}