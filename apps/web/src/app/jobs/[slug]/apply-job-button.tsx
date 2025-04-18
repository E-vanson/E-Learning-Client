"use client";

import { applyJob } from "@/lib/actions/job-application/apply-job";
import { uploadImage } from "@/lib/actions";
import { parseErrorResponse } from "@/lib/parse-error-response";
import { Input, Textarea } from "@elearning/ui/forms";  
import { Job, Freelancer, EstimatedTime } from "@elearning/lib/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Paperclip, X } from "lucide-react";
import {
  Dialog,
  Button,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  useToast,
  Separator,
} from "@elearning/ui";
import { ChangeEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getJobData } from "@/lib/actions/job-application/get-job";
import { notFound } from "next/navigation";
import { useAppSelector } from "@elearning/global-store";
import { selectUser } from "@elearning/global-store/slices";
import { getFreelancerProfile } from "@/lib/actions/job-application/get-freelancer";

const schema = z.object({
  coverLetter: z.string().min(1, {
    message: "Please provide a cover letter",
  }),
  bidAmount: z.string().min(1, {
    message: "Please enter your bid amount",
  }),
  estimatedTime: z.custom<EstimatedTime>(val => 
  typeof val === "string" && 
  ["1 Month", "1 - 2 Months", "3 Months", "More Than 3 Months"].includes(val), {
    message: "Please provide an estimated completion time"
  }),
  jobId: z.string(),
  freelancerId: z.string(),
});

type JobProposalForm = z.infer<typeof schema>;

interface PageProps {
  params: { slug: string };
}

export default async function JobProposalCreate({ params }: PageProps) {
  const [isUploading, setUploading] = useState(false);
  const [fileAttachment, setFileAttachment] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isOpen, setOpen] = useState(false);

  const user = useAppSelector(selectUser);
  const userId = user?.id;
  if (!userId) return notFound;
  const job = await getJobData(params.slug);   
  if (!job) notFound();
  
  const freelancer = await getFreelancerProfile(userId);

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    watch,
    setValue,
    reset
  } = useForm<JobProposalForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      coverLetter: "",
      bidAmount: "",
      estimatedTime: '1 - 2 Months',
      jobId: job.id,
      freelancerId: freelancer.id,
    },
  });

  const handleCreate = async (values: JobProposalForm) => {
    try {
      // Convert bid_amount from string to number
      const bidAmount = parseFloat(values.bidAmount);
      
        await applyJob(
            job.id,
            {
        ...values,
        bidAmount: bidAmount,
        fileAttachment: fileAttachment ?? undefined,
            },
            'true'
        );
      
      toast({
        title: "Success",
        description: "Job proposal submitted successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: parseErrorResponse(error),
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files;
      if (files && files.length > 0) {
        const file = files[0]!;
        const fileSize = file.size / (1024 * 1024);

        if (fileSize > 5) {
          throw "File size too big (max 5MB).";
        }

        setUploading(true);
        const form = new FormData();
        form.append("file", file);
        const url = await uploadImage(form);
        
        setFileAttachment(url);
        setFileName(file.name);

        toast({
          title: "Success",
          description: "File uploaded successfully",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: parseErrorResponse(error),
        variant: "destructive",
      });
    } finally {
      event.target.value = "";
      setUploading(false);
    }
  };

  const removeAttachment = () => {
    setFileAttachment(null);
    setFileName(null);
  };

  return (
     <Dialog
          open={isOpen}
          onOpenChange={(op) => {
            setOpen(op);
            reset();
          }}
        >
          <DialogTrigger asChild>
            <Button variant="teal" color="teal">New Proposal</Button>
          </DialogTrigger>
    
          <DialogContent onInteractOutside={(evt) => evt.preventDefault()}>
            <DialogHeader>
              <DialogTitle>Create Job</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(evt) => {
              evt.preventDefault();
              handleSubmit(handleCreate)();
            }}
            >
              <div className="grid grid-cols-1 gap-4">
                <Textarea
                  label="Cover Letter"
                  id="coverLetterInput"
                  placeholder="Introduce yourself and explain why you're a good fit for this job"
                  rows={6}
                  {...register("coverLetter")}
                  error={errors.coverLetter?.message}
                />
    
                <Input
                label="Bid Amount ($)"
                id="bidAmountInput"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter your bid amount"
                {...register("bidAmount")}
                error={errors.bidAmount?.message}
              />
    
                <Input
                  label="Estimated Time"
                  id="estimatedTimeInput"
                  type="text"
                  placeholder="e.g., 2 weeks, 1 month"
                  {...register("estimatedTime")}
                  error={errors.estimatedTime?.message}
                />                                    
          </div>
          
              <div className="space-y-2">
              <label className="text-sm font-medium">Attachment</label>
                            {fileAttachment ? (
                <div className="flex items-center p-3 bg-gray-50 rounded border">
                  <Paperclip className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm flex-1 truncate">{fileName}</span>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={removeAttachment}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div 
                  className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => {
                    if (!isUploading) {
                      fileRef.current?.click();
                    }
                  }}
                >
                  {isUploading ? (
                    <div className="flex items-center justify-center">
                      <LoaderCircle className="h-6 w-6 mr-2 animate-spin text-gray-400" />
                      <span className="text-gray-500">Uploading...</span>
                    </div>
                  ) : (
                    <>
                      <Paperclip className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">
                        Drag and drop a file or click to browse
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Max file size: 5MB
                      </p>
                    </>
                  )}
                </div>
              )}
              
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
              </div>
    
              <DialogFooter className="mt-6">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="default"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <LoaderCircle className="mr-2 size-4 animate-spin" />
                  )}
                  Apply Job
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
    // <div className="container mx-auto py-6">
    //   <h1 className="text-2xl font-bold mb-6">Create Job Proposal</h1>
      
    //   <div className="bg-white p-6 rounded-lg shadow">
    //     <div className="mb-6">
    //       <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
    //       <p className="text-gray-600 mb-4">{job.description}...</p>
    //       <div className="flex items-center text-sm text-gray-500">
    //         <span className="font-medium">Budget: ${job.budget}</span>
    //         <Separator orientation="vertical" className="h-4 mx-3" />
    //         <span>{job.deadline}</span>
    //       </div>
    //     </div>
        
    //     <Separator className="my-6" />
        
    //     <form
    //       onSubmit={(evt) => {
    //         evt.preventDefault();
    //         handleSubmit(handleCreate)();
    //       }}
    //     >
    //       <div className="space-y-6">
    //         <Textarea
    //           label="Cover Letter"
    //           id="coverLetterInput"
    //           placeholder="Introduce yourself and explain why you're a good fit for this job"
    //           rows={6}
    //           {...register("coverLetter")}
    //           error={errors.coverLetter?.message}
    //         />
            
    //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //           <Input
    //             label="Bid Amount ($)"
    //             id="bidAmountInput"
    //             type="number"
    //             step="0.01"
    //             min="0"
    //             placeholder="Enter your bid amount"
    //             {...register("bidAmount")}
    //             error={errors.bidAmount?.message}
    //           />
              
    //           <Input
    //             label="Estimated Time"
    //             id="estimatedTimeInput"
    //             type="text"
    //             placeholder="e.g., 2 weeks, 1 month"
    //             {...register("estimatedTime")}
    //             error={errors.estimatedTime?.message}
    //           />
    //         </div>
            
    //         <div className="space-y-2">
    //           <label className="text-sm font-medium">Attachment</label>
              
    //           {fileAttachment ? (
    //             <div className="flex items-center p-3 bg-gray-50 rounded border">
    //               <Paperclip className="h-4 w-4 mr-2 text-gray-500" />
    //               <span className="text-sm flex-1 truncate">{fileName}</span>
    //               <Button 
    //                 type="button" 
    //                 variant="ghost" 
    //                 size="sm"
    //                 onClick={removeAttachment}
    //               >
    //                 <X className="h-4 w-4" />
    //               </Button>
    //             </div>
    //           ) : (
    //             <div 
    //               className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition"
    //               onClick={() => {
    //                 if (!isUploading) {
    //                   fileRef.current?.click();
    //                 }
    //               }}
    //             >
    //               {isUploading ? (
    //                 <div className="flex items-center justify-center">
    //                   <LoaderCircle className="h-6 w-6 mr-2 animate-spin text-gray-400" />
    //                   <span className="text-gray-500">Uploading...</span>
    //                 </div>
    //               ) : (
    //                 <>
    //                   <Paperclip className="h-6 w-6 mx-auto mb-2 text-gray-400" />
    //                   <p className="text-sm text-gray-500">
    //                     Drag and drop a file or click to browse
    //                   </p>
    //                   <p className="text-xs text-gray-400 mt-1">
    //                     Max file size: 5MB
    //                   </p>
    //                 </>
    //               )}
    //             </div>
    //           )}
              
    //           <input
    //             ref={fileRef}
    //             type="file"
    //             className="hidden"
    //             onChange={handleFileUpload}
    //           />
    //         </div>
            
    //         <div className="pt-4">
    //           <Button 
    //             type="submit" 
    //             color="primary" 
    //             className="w-full md:w-auto"
    //             disabled={isSubmitting || isUploading}
    //           >
    //             {isSubmitting && (
    //               <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
    //             )}
    //             Submit Proposal
    //           </Button>
    //         </div>
    //       </div>
    //     </form>
    //   </div>
    // </div>
  );
}