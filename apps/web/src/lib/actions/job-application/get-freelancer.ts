"use server";

import { getSession } from "@/lib/auth";
import { API_URL_LOCAL } from "@/lib/constants";
import { validateResponse } from "@/lib/validate-response";




// Add this function to fetch employer data
export async function getFreelancerProfile(userId: string) {  
  console.log("At the beginning of the request");
  const session =  await getSession();
  const url = `${API_URL_LOCAL}/freelancer/profile/${userId}`;

  try {
    const response = await fetch(url, { 
        method: "GET",       
        headers: {
          Cookie: session.cookie,        
      },
    });   
    console.log("The response: ", response);
    await validateResponse(response);
    const data = await response.json();  
    console.log("The freelancer data: ", data);
    return data;
      
  } catch (error) {
    console.error("Error fetching employer data:", error);
    return null;
  }
}