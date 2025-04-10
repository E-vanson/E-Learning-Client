"use server";

import { getSession } from "@/lib/auth";
import { API_URL, API_URL_LOCAL } from "@/lib/constants";
import * as jose from "jose";
import { redirect } from "next/navigation";

    export async function VerifyEmail(id: string, status: boolean) {
    const session = await getSession();  
    const { accessToken } = session;
    
    const url = `${API_URL}/auth/verifing-email`;
    const body = {
        id: id,
        status: status,
    };

    const resp = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
            Cookie: session.cookie,
        },
    });
     console.log("The response verifying email: ", resp, body);                    
    if (!resp.ok) {
        const json = await resp.json();
        throw new Error(json["error"]["message"]);
    }
   
    return resp.ok;
    }
