import { API_URL_LOCAL } from "@/lib/constants";
import { validateResponse } from "@/lib/validate-response";
import { Job } from "@elearning/lib/models";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import JobEditPage from "./job-edit-page";

const getJob = async (id: string) => {
  try {
    const url = `${API_URL_LOCAL}/admin/jobs/${id}`;
    console.log("Fetching job from:", url);

    const resp = await fetch(url, {
      headers: {
        Cookie: cookies().toString(),
      },
    });
    console.log("Response status:", resp.status);

    await validateResponse(resp);

    const data = await resp.json();
    console.log("Job data received:", data);
    return data as Job;
  } catch (error) {
    console.error("Error fetching job:", error);
    return undefined;
  }
};

export default async function JobEdit({ params }: { params: { id: string } }) {
  const job = await getJob(params.id);
  console.log(job, "The job...");

  if (!job) {
    notFound();
  }

  // const authorPage = getAuthors();
  // const tagPage = getTags();

  // const [authors, tags] = await Promise.all([authorPage, tagPage]);

  return <JobEditPage job={job} />;
}
