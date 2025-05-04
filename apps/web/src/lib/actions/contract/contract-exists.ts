"use server"

import { getSession } from "@/lib/auth";
import { API_URL_LOCAL } from "@/lib/constants";

export async function ifContractExists(proposalId: number) {
    console.log("Inside find existing contract api")
    const session = await getSession();

    const url = `${API_URL_LOCAL}/contract/proposal-exists/${proposalId}`;

    try {
        const resp = await fetch(url, {
            method: "GET",            
            headers: {
            Cookie: session.cookie,           
            },
        });
        console.log("The contract-exists response: ", resp);
    
        if (!resp.ok) {
            const errorText = await resp.text();
            throw new Error(`HTTP ${resp.status}: ${errorText}`);
        }        
                
        const data = await resp.json();
        return data; 
        
    } catch (error) {
        console.error("Contract fetch failed:", error);        
        throw error;        
    }
}