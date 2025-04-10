"use server"

import { getSession } from "@/lib/auth";
import { API_URL_LOCAL } from "@/lib/constants";
import { validateResponse } from "@/lib/validate-response";
import { UserJobRole } from "@elearning/lib/models";
import { revalidatePath } from "next/cache";

export async function createUserJobProfile(role: UserJobRole, body: object) {
    console.log("At the beginning of teh request");
    const session = await getSession();
    let path = '';

    role === 'freelancer' ? path = 'freelancer' : path = 'employer';
    
    const url = `${API_URL_LOCAL}/${path}`;

    const resp = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
        Cookie: session.cookie,
        "Content-Type": "application/json",
    },
    });
    
    await validateResponse(resp);
    const data = await resp.json();
    console.log("The data: ", data);
    revalidatePath("/profile");
    return data;

}