"use client";

import { deleteJob } from "@/lib/actions/job/delete-job";
import { parseErrorResponse } from "@/lib/parse-error-response";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    Button,
    useToast,
} from "@elearning/ui";
import { Job } from "@elearning/lib/models";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";

export default function JobDeleteButton({ job }: { job: Job }) {
  const [isDeleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteJob(job.id, true);
    } catch (error) {
      toast({
        title: "Error",
        description: parseErrorResponse(error),
        variant: "destructive",
      });
      setDeleting(false);
    }
  };

  return (  
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete job</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure to delete job: &ldquo;
            {job.title ?? "(Untitled)"}
            &ldquo;?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button onClick={handleDelete} disabled={isDeleting}>
            {isDeleting && (
              <LoaderCircle className="mr-2 size-4 animate-spin" />
            )}
            Proceed
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
