import { getSession } from "@/lib/auth";
import { API_URL_LOCAL } from "@/lib/constants";
import { validateResponse } from "@/lib/validate-response";



// Add this function to fetch employer data
export async function getFreelancerProfile(userId: string) {  
  const session =  await getSession();
  const url = `${API_URL_LOCAL}/freelancer/profile/${userId}`;

  try {
    const response = await fetch(url, { 
      method: "GET", 
      cache: "no-store",
      headers: {
        Cookie: session.cookie,
        "Content-Type": "application/json",
    },
    });   
    await validateResponse(response);
    const data = await response.json();  
    return data;
      
  } catch (error) {
    console.error("Error fetching employer data:", error);
    return null;
  }
}