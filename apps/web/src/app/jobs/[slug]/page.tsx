import {
  Button,
  Card,
  CardContent,
  Separator,
} from "@elearning/ui";
import { Job, EmployerProfile } from "@elearning/lib/models";
import {
  formatCurrency,
  formatRelativeTimestamp,
  uppercaseFirstChar,
} from "@elearning/lib/utils";
import {
  Briefcase,
  CalendarDays,
  Clock,
  DollarSign,
  MapPin,
  Star,
  User2,
} from "lucide-react";
import Link from "next/link";
import { getJobData } from "@/lib/actions/job-application/get-job";
import { API_URL_LOCAL } from "@/lib/constants";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { User } from "@elearning/lib/models";
import { getSession } from "@/lib/auth";
import { getEmployerData } from "@/lib/actions/job-application/get-employer";
import ApplyJobButton from "./apply-job-button";

interface PageProps {
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

export default async function JobPage({ params }: PageProps) {
  const user = await getUser();
  // if (!user) {
  //   redirect("/login");
  // }
  console.log("Inside job....", params.slug)
  // const session = await getSession();
  
  // Fetch job data
  const job = await getJobData(params.slug);
  console.log("The job data: ", job);
  if (!job) notFound();

  // Fetch employer data (you'll need to implement this)
  const employer = await getEmployerData(job.employerId); 
  console.log("The employer: ", employer);

  return (
    <>
      <div className="bg-teal-50p dark:bg-muted/70 py-6 lg:py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="flex flex-col lg:col-span-8 order-2 lg:order-1">
              <h2 className="text-primary-foreground dark:text-foreground mb-5">
                {job.title}
              </h2>
              <p className="text-primary-foreground dark:text-foreground font-light mb-5">
                {job.description}
              </p>
              <div className="flex flex-wrap gap-4 text-primary-foreground/85 dark:text-foreground/70">
                <div className="flex items-center hover:text-teal">
                  <Briefcase className="size-4" />
                  <span className="ms-1 text-sm">
                    {uppercaseFirstChar(job.experienceLevel)}
                  </span>
                </div>

                <div className="flex items-center hover:text-teal">
                  <DollarSign className="size-4" />
                  <span className="ms-1 text-sm">
                    {formatCurrency(job.budget)}{" "}
                    {job.budgetType === "hourly" && "/hr"}
                  </span>
                </div>

                <div className="flex items-center hover:text-teal">
                  <CalendarDays className="size-4" />
                  <span className="ms-1 text-sm">
                    {formatRelativeTimestamp(job.deadline)}
                  </span>
                </div>
              </div>
            </div>
            {/* <div className="aspect-w-16 aspect-h-9 bg-gray-100 drop-shadow-xl rounded-md lg:col-span-4 order-1 lg:order-2">
              {employer?.companyLogo && (
                <Image
                  src={employer.companyLogo}
                  className="object-cover p-1"
                  alt="Company logo"
                  fill
                  sizes="50vh"
                  priority
                />
              )}
            </div> */}
          </div>
        </div>
      </div>
      
      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-10">
          <div className="lg:col-span-8 order-2 lg:order-1">
            <div className="bg-background rounded-md border">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Job Details</h3>
                
                {/* <div className="prose dark:prose-invert max-w-none">
                  {job.responsibilities && (
                    <>
                      <h4>Key Responsibilities</h4>
                      <ul>
                        {job.responsibilities.map((responsibility, index) => (
                          <li key={index}>{responsibility}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {job.requirements && (
                    <>
                      <h4 className="mt-6">Requirements</h4>
                      <ul>
                        {job.requirements.map((requirement, index) => (
                          <li key={index}>{requirement}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div> */}

                <Separator className="my-6" />

                {job.skillsRequired && (
                  <>
                    <h4 className="text-lg font-semibold mb-4">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.skillsRequired.map((skill:any, index: number) => (
                        <span key={index} className="bg-muted px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 order-1 lg:order-2">
            <Card className="shadow-none">
              <CardContent className="p-4 flex flex-col">
                <div className="flex gap-2 items-center justify-between mb-7">
                  <h3 className="font-semibold">
                    {uppercaseFirstChar(job.status)}
                  </h3>
                </div>

                {/* <Button variant="teal" className="w-full">
                  Apply Now
                </Button> */}

                <ApplyJobButton params={params}/>

                <Separator className="my-5" />

                <h4 className="font-semibold mb-4">Job Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Clock className="size-4 text-teal mr-2" />
                    <span>Job Type:</span>
                    <span className="ml-auto text-muted-foreground">
                      {uppercaseFirstChar(job.budgetType)}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <Star className="size-4 text-teal mr-2" />
                    <span>Experience:</span>
                    <span className="ml-auto text-muted-foreground">
                      {uppercaseFirstChar(job.experienceLevel)}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <CalendarDays className="size-4 text-teal mr-2" />
                    <span>Deadline:</span>
                    <span className="ml-auto text-muted-foreground">
                      {new Date(job.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {employer && (
                  <>
                    <Separator className="my-5" />
                    <h4 className="font-semibold mb-4">Employer Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <User2 className="size-4 text-teal mr-2" />
                        <span>Company:</span>
                        <span className="ml-auto text-muted-foreground">
                          {employer.companyName}
                        </span>
                      </div>

                      {/* {employer.location && (
                        <div className="flex items-center">
                          <MapPin className="size-4 text-teal mr-2" />
                          <span>Location:</span>
                          <span className="ml-auto text-muted-foreground">
                            {employer.location}
                          </span>
                        </div>
                      )} */}

                      {employer.website && (
                        <div className="flex items-center">
                          <Link
                            href={employer.website}
                            className="text-teal underline ml-auto"
                            target="_blank"
                          >
                            Visit Website
                          </Link>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

