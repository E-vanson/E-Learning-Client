"use server"

import { getSession } from "@/lib/auth";
import { API_URL_LOCAL } from "@/lib/constants";
import { validateResponse } from "@/lib/validate-response";
import { Contract } from "@elearning/lib/models";

export async function deleteContract(id: string) {
    console.log("Inside delete contract api")
    const session = await getSession();

    const url = `${API_URL_LOCAL}/contract/${id}`

    try {
        const resp = await fetch(url, {
            method: "DELETE",            
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
        console.error("Contract DELETION failed:", error);        
        throw error;        
    }
}