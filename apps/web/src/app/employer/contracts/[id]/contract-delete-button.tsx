"use client";

import { deleteContract } from "@/lib/actions/contract/delete-contract";
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
import { Contract, Job } from "@elearning/lib/models";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";

export default function JobDeleteButton({ contract }: { contract: Contract }) {
  const [isDeleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const result = await deleteContract(contract.id);
      if (result) {
        toast({
        title: "Deleted",
        description: "Contract Deleted Successfully",
        variant: "success",
      });
      } else {
        toast({
        title: "Error",
        description: "Failed To Delete contract",
        variant: "destructive",
      });
      }
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
        <Button variant="destructive">Delete contract</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure to delete contract: &ldquo;
            {contract.terms.scopeOfWork ?? "(Untitled)"}
            &ldquo;?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button onClick={handleDelete} variant='destructive' disabled={isDeleting}>
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
