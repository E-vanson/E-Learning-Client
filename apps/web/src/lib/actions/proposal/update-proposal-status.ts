"use server";

import { getSession } from "@/lib/auth";
import { API_URL_LOCAL } from "@/lib/constants";
import { validateResponse } from "@/lib/validate-response";
import { ProposalStatus } from "@elearning/lib/models";

export async function updateProposalStatus(id: number, status: ProposalStatus) { 
    console.log("The prop status update api: ")
    const session = await getSession();

    const url = `${API_URL_LOCAL}/proposals/status/${id}`;
    console.log("The prop id: ", id, " The update status: ", status)

    const proposalStatus = {
        status: status
    }

    try {
        const resp = await fetch(url, {
            method: "PATCH",
            body: JSON.stringify(proposalStatus),
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
        console.error("Proposal Status Update Failed:", error);
        throw error;        
    }
}