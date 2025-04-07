"use client";

import { applyJob } from "@/lib/actions/job-application/apply-job";
import { parseErrorResponse } from "@/lib/parse-error-response";
import { Button, ToastAction, useToast } from "@elearning/ui";
import { useAppSelector } from "@elearning/global-store";
import { selectUser } from "@elearning/global-store/slices";
import { Course, Job } from "@elearning/lib/models";
import { Link, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useContext, useState } from "react";

export default function ApplyJobButton({
  job,
  className,
  revalidate,
  children,
}: {
  job?: Job;
  className?: string;
  revalidate?: string;
  children?: ReactNode;
}) {
  const user = useAppSelector(selectUser);
  const [isLoading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleProposal = async () => {    
    if (!user) {
      router.push("/login");
      return;
    }

    if (!user.emailVerified) {
      router.push("/verify-email");
    }

    if (job?.status === "closed" && user.expiredAt < new Date().getTime()) {
      router.push("/pricing");
      return;
    }
    try {
      setLoading(true);
      await applyJob(job?.id ?? 0, revalidate);
      toast({
        title: "Success",
        description: "job enrollment success",
        variant: "success",
        // action: (
        //   // <ToastAction altText="Start learning course" asChild>
        //   //   <Link
        //   //     href={`/learn/${course.slug}/lessons/${enrolledCourse?.resumeLesson?.slug}`}
        //   //   >
        //   //     Resume
        //   //   </Link>
        //   // </ToastAction>
        // ),
      });
    } catch (error) {
      toast({
        title: "Error",
        description: parseErrorResponse(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleProposal}
      disabled={isLoading}
      className={className}
      variant="teal"
    >
      {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
