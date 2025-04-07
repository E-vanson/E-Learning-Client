import { API_URL_LOCAL } from "@/lib/constants";
import {
  Alert,
  Card,
  CardContent,
  Pagination,
  Separator,  
} from "@elearning/ui";

import { Page, Job, ExperienceLevel, BudgetType, JobStatus } from "@elearning/lib/models";
import {
  buildQueryParams,
  formatRelativeTimestamp,
  formatCurrency,
} from "@elearning/lib/utils";
import { BriefcaseIcon, CalendarDaysIcon, ClockIcon, DollarSignIcon, StarIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

interface Props {
  searchParams: { [key: string]: string | undefined };
}

export const metadata: Metadata = {
  title: "Job Listings",
  description: "Browse available job opportunities",
};

const getJobs = async ({ searchParams }: Props) => {
  const query = buildQueryParams({ 
    page: searchParams["page"], 
    limit: 10,
    status: "active"
  });

  const url = `${API_URL_LOCAL}/content/jobs${query}`;

  const resp = await fetch(url, { cache: "no-store" });

  if (!resp.ok) {
    console.error("API Error:", resp.status, await resp.text());
    return undefined;
  }

  console.log("The content response: ", resp);
  return resp.json().then(json => json as Page<Job>).catch(() => undefined);
};

// const getSkills = async () => {
//   const url = `${API_URL_LOCAL}/content/jobs/skills`;
//   const resp = await fetch(url, { cache: "no-store" });
//   return resp.json().then(json => json as string[]).catch(() => []);
// };

export default async function Jobs(props: Props) {
  const jobs = await getJobs(props);

  const content = () => {
    if (!jobs?.contents) {
      return <Alert variant="destructive">Failed to load job listings</Alert>;
    }

    if (jobs.contents.length === 0) {
      return <Alert>No current job openings</Alert>;
    }


    return jobs.contents.map(job => (
      <div key={job.id} className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4 p-4 bg-card rounded-lg border">
          <div className="flex flex-col grow">
            <Link 
              href={`/jobs/${job.slug}`}
              className="font-semibold text-xl line-clamp-2 hover:text-teal"
            >
              {job.title}
            </Link>
            
            {/* <div className="mt-2 flex flex-wrap gap-2">
              {job.skillsRequired?.map(skill => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </div> */}

            <p className="text-muted-foreground mt-2 line-clamp-3">
              {job.description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="flex items-center gap-1">
                <DollarSignIcon size={16} />
                <span>
                  {formatCurrency(job.budget)} {job.budgetType === 'hourly' ? '/hr' : ''}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <CalendarDaysIcon size={16} />
                <span>{formatRelativeTimestamp(job.deadline)}</span>
              </div>

              <div className="flex items-center gap-1">
                <StarIcon size={16} />
                <span>{uppercaseFirstChar(job.experienceLevel)}</span>
              </div>

              <div className="flex items-center gap-1">
                <ClockIcon size={16} />
                <span>{uppercaseFirstChar(job.status)}</span>
              </div>
            </div>
          </div>
        </div>
        <Separator className="mt-4" />
      </div>
    ));
  };

  return (
    <>
      <div className="bg-teal-50p dark:bg-muted/70 h-[8rem]">
        <div className="container h-full flex items-center">
          <h2 className="text-primary-foreground dark:text-foreground">
            Current Job Openings
          </h2>
        </div>
      </div>
      
      <div className="container py-7 mb-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-8 order-2 xl:order-1">
            <div className="grid grid-cols-1 gap-4">{content()}</div>
            <div className="flex justify-center mt-6">
              <Pagination
                totalPage={jobs?.totalPage ?? 0}
                currentPage={jobs?.currentPage ?? 0}
                LinkComponent={Link}
              />
            </div>
          </div>
          
          {/* <div className="xl:col-span-4 order-1 xl:order-2">
            <Card>
              <CardContent className="p-4">
                <h6 className="mb-4">Popular Skills</h6>
                <div className="flex flex-wrap gap-2">
                  {skills?.map(skill => (
                    <Badge 
                      key={skill} 
                      variant="outline"
                      className="px-3 py-1 text-sm"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div> */}
        </div>
      </div>
    </>
  );
}

// Helper function
const uppercaseFirstChar = (str?: string) => 
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '';