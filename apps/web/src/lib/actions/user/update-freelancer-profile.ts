"use server"

import { getSession } from "@/lib/auth";
import { API_URL_LOCAL } from "@/lib/constants";
import { validateResponse } from "@/lib/validate-response";
import { Freelancer, UserJobRole } from "@elearning/lib/models";
import { revalidatePath } from "next/cache";

export async function updateUserFreelancerProfile(body: Freelancer) {
    console.log("At the beginnig of the req: ");
    const session = await getSession();
    const profileId = body.id;
    const url = `${API_URL_LOCAL}/freelancer/${profileId}`;

    const resp = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
        Cookie: session.cookie,
        "Content-Type": "application/json",
    },
    });
    console.log("The freelancer update data: ", resp);

    await validateResponse(resp);

    const data = await resp.json();
    console.log("The freelancer update data: ", data);
    revalidatePath("/profile");
    return data;
}