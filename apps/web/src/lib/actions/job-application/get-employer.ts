"use server";

import { API_URL_LOCAL } from "@/lib/constants";
import { validateResponse } from "@/lib/validate-response";



// Add this function to fetch employer data
export async function getEmployerData(id: string) {  
  const url = `${API_URL_LOCAL}/employer/profile/${id}`;

  try {
    const response = await fetch(url, { 
      method: "GET", 
      cache: "no-store",
    });   
    await validateResponse(response);
    const data = await response.json();  
    return data;
      
  } catch (error) {
    console.error("Error fetching employer data:", error);
    return null;
  }
}