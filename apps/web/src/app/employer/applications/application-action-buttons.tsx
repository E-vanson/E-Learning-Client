"use client";

import { deleteJob } from "@/lib/actions/jobs/delete-job";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useToast,
} from "@elearning/ui";
import { Job, Proposal } from "@elearning/lib/models";
import { Edit, LoaderCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ApplicationActionButtons({ proposal }: { proposal: Proposal }) {
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [isDeleting, setDeleting] = useState(false);

  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteJob(proposal.id);
      setAlertOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: parseErrorResponse(error),
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex justify-start gap-2">
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger>
            <Button variant="default" asChild size="icon">
              <Link href={`/employer/jobs/${proposal.id}`}>
                <Edit size={20} />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit proposal</TooltipContent>
        </Tooltip>

        <AlertDialog open={isAlertOpen} onOpenChange={setAlertOpen}>
          <Tooltip delayDuration={300}>
            <TooltipTrigger>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon" asChild>
                  <span>
                    <Trash2 size={20} />
                  </span>
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>Delete job</TooltipContent>
          </Tooltip>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure to delete job: &ldquo;{proposal.job.title ?? "(Untitled)"}
                &ldquo;?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                Cancel
              </AlertDialogCancel>
              <Button onClick={handleDelete} variant="destructive" disabled={isDeleting}>
                {isDeleting && (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                )}
                Proceed
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TooltipProvider>
    </div>
  );
}
