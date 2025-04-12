"use server";

import { API_URL_LOCAL } from "@/lib/constants";
import { validateResponse } from "@/lib/validate-response";
import { getSession } from "@/lib/auth";



// Add this function to fetch employer data
export async function getEmployerData(userId: string) {  
  console.log("Getting the emoloyer", userId)
  const session =  await getSession();
  const url = `${API_URL_LOCAL}/employer/profile/${userId}`;

  try {
    const response = await fetch(url, { 
        method: "GET",       
        headers: {
          Cookie: session.cookie,        
      },
    });      
    console.log(" fetching employer data:", response)
    await validateResponse(response);
    const data = await response.json();  
    console.log(" employer data:", data)
    return data;
      
  } catch (error) {
    console.error("Error fetching employer data:", error);
    return null;
  }
}