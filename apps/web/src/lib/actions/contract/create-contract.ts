"use server"

import { getSession } from "@/lib/auth";
import { API_URL_LOCAL } from "@/lib/constants";
import { validateResponse } from "@/lib/validate-response";
import { Contract } from "@elearning/lib/models";

export async function createContract(body: Contract) {
    console.log("Inside create contract api")
    const session = await getSession();

    const url = `${API_URL_LOCAL}/contract`

    try {
        const resp = await fetch(url, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
            Cookie: session.cookie,
            "Content-Type": "application/json",
            },
        });
        console.log("The contract response: ", resp);
    
        if (!resp.ok) {
            const errorText = await resp.text();
            throw new Error(`HTTP ${resp.status}: ${errorText}`);
        }        
                
        return true
        
        
    } catch (error) {
        console.error("Contract creation failed:", error);        
        throw error;        
    }
}