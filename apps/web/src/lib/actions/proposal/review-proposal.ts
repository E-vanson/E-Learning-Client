"use server";

import { getSession } from "@/lib/auth";
import { API_URL_LOCAL } from "@/lib/constants";
import { validateResponse } from "@/lib/validate-response";
import { ProposalReview } from "@elearning/lib/models";

export async function reviewProposal(id: number, review: ProposalReview) { 
    console.log("The prop review api: ")
    const session = await getSession();

    const url = `${API_URL_LOCAL}/proposals/review/${id}`;
    console.log("The prop id: ", id, " The review: ", review)    

    try {
        const resp = await fetch(url, {
            method: "PATCH",
            body: JSON.stringify(review),
            headers: {
                Cookie: session.cookie,
                "Content-Type": "application/json"
            }
        });

        console.log("The response object: ", resp);

        if (!resp.ok) {
            const errorText = await resp.text();
            throw new Error(`HTTP ${resp.status}: ${errorText}`);
        }

        await validateResponse(resp);
        return true;        
    } catch (error) {
        console.error("Proposal Review Failed:", error);
        throw error;        
    }
}