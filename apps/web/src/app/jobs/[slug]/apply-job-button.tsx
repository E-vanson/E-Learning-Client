"use server";

import { getFreelancerProfile } from "@/lib/actions/job-application/get-freelancer";
import { getJobData } from "@/lib/actions/job-application/get-job";
import { notFound, redirect } from "next/navigation";
import ApplyJobDialog from "./apply-job-form";
import { API_URL_LOCAL } from "@/lib/constants";
import { cookies } from "next/headers";
import { User } from "@elearning/lib/models";


interface Props {
  params: { slug: string };
}

const getUser = async () => {
  const url = `${API_URL_LOCAL}/profile`;
  const resp = await fetch(url, {
    headers: {
      Cookie: cookies().toString(),
    },
  });

  return resp.ok ? ((await resp.json()) as User) : null;
};


export default async function ApplyJobButton({ params }: Props) {
  // Authentication check
  const user = await getUser();
  if (!user) redirect("/login");

  // Data fetching
  const job = await getJobData(params.slug);
  if (!job) notFound();

  // Freelancer profile check
  const freelancer = await getFreelancerProfile(user.id);
  if (!freelancer) redirect("/login ");

  return <ApplyJobDialog job={job} freelancer={freelancer} />;
}