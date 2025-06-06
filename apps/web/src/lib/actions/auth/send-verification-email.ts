"use server";

import { getSession } from "@/lib/auth";
import * as jose from "jose";
import { redirect } from "next/navigation";

export async function sendVerificationEmail() {
  const session = await getSession();
  console.log("Sending the verification email: ")
  const { accessToken } = session;
  
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`;
  const body = {
    requestType: "VERIFY_EMAIL",
    idToken: accessToken,
  };

  const resp = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!resp.ok) {
    const json = await resp.json();
    throw new Error(json["error"]["message"]);
  }
  console.log("The response: ", resp);
  return resp.ok;
}
