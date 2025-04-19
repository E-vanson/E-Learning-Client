"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job, Freelancer, EstimatedTime } from "@elearning/lib/models";
import { uploadImage } from "@/lib/actions";
import { applyJob } from "@/lib/actions/job-application/apply-job";
import { parseErrorResponse } from "@/lib/parse-error-response";
import { useState, useRef, ChangeEvent } from "react";
import { custom, z } from "zod";
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
import { Input, Textarea, Select } from "@elearning/ui/forms";
import { LoaderCircle, Paperclip, UploadCloud, X } from "lucide-react";
// Add other necessary UI imports

const schema = z.object({
  cover_letter: z.string().min(1, "Please provide a cover letter"),
  bid_amount: z.string().min(1, "Please enter your bid amount"),
  estimated_time: z.custom<EstimatedTime>(val => 
  typeof val === "string" && 
  ["1 Month", "1 - 2 Months", "3 Months", "More Than 3 Months"].includes(val), {
    message: "Please provide an estimated completion time"
  }),
  jobId: z.string(),
  freelancerId: z.string()
});

type JobProposalForm = z.infer<typeof schema>;

interface ApplyJobDialogProps {
  job: Job;
  freelancer: Freelancer;
}

export default function ApplyJobDialog({ job, freelancer }: ApplyJobDialogProps) {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isOpen, setOpen] = useState(false);
  const [isUploading, setUploading] = useState(false);
  const [fileAttachment, setFileAttachment] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const jobId = job.id.toString();  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);  
  const { register, handleSubmit, formState, reset, control } = useForm<JobProposalForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      cover_letter: "",
      bid_amount: "",
      estimated_time: "1 - 2 Months",
      jobId: jobId,
      freelancerId: freelancer.id
    }
  });

    const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        try {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            throw new Error("File size exceeds 5MB limit");
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        
        const url  = await uploadImage(formData);
        
        setFileAttachment(url);
        setFileName(file.name);
        
        toast({
            title: "Success",
            description: "File uploaded successfully",
            variant: "success"
        });
        } catch (error) {
        toast({
            title: "Upload Failed",
            description: parseErrorResponse(error),
            variant: "destructive"
        });
        } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = "";
        }
    };

    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast({
            title: "File Too Large",
            description: "Maximum file size is 5MB",
            variant: "destructive"
            });
            event.target.value = ""; // Clear the input
            return;
        }

        setSelectedFile(file);
        };

        const handleRemoveFile = () => {
        setSelectedFile(null);
        if (fileRef.current) fileRef.current.value = "";
        };

        const onSubmit = async (values: JobProposalForm) => {
        try {
            let fileUrl: string | undefined;
            
            // Upload file only if exists
            if (selectedFile) {
            setUploading(true);
            const formData = new FormData();
            formData.append("file", selectedFile);
            const url  = await uploadImage(formData);
            fileUrl = url;
            }

            const result = await applyJob(
            jobId,
            {
                ...values,
                status: 'pending',
                bid_amount: parseFloat(values.bid_amount),
                file_attachment: fileUrl,
                job: job,
                freelancer: freelancer
            },
            'true'
            );

            if (result) {
            toast({
                title: "Application Submitted",
                description: "Your proposal has been sent successfully",
                variant: "success"
            });
            setOpen(false);
            reset();
            setSelectedFile(null);
            } else {
            toast({
                title: "Application Failed",
                description: "Your proposal application has failed ",
                variant: "destructive"
            });
            setOpen(false);
            }
        } catch (error) {
            toast({
            title: "Submission Failed",
            description: parseErrorResponse(error),
            variant: "destructive"
            });
        } finally {
            setUploading(false);
        }
        };

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button variant="teal">Apply Now</Button>
        </DialogTrigger>
        
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Submit Proposal</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit(onSubmit)}>
            {/* Form fields */}
            <Textarea
                label="Cover Letter"
                {...register("cover_letter")}
                error={formState.errors.cover_letter?.message}
            />
            
            <Input
                label="Bid Amount ($)"
                type="number"
                step="0.01"
                {...register("bid_amount")}
                error={formState.errors.bid_amount?.message}
            />
            
            <Controller
                control={control}
                name="estimated_time"
                render={({ field, fieldState: { error } }) => (
                <Select
                    label="Estimated Time"
                    {...field}
                    error={error?.message}
                >
                    <option value="1 Month">1 Month</option>
                    <option value="1 - 2 Months">1 - 2 Months</option>
                    <option value="3 Months">3 Months</option>
                    <option value="More Than 3 Months">More Than 3 Months</option>    
                </Select>
                )}
            />            
            
            {/* File upload section */}
            <div className="space-y-2">
                <label className="font-medium">Attachment</label>
                {selectedFile && (
                    <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm truncate">{selectedFile.name}</span>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveFile}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                    </div>
                )}
                        
                  <div
                className="border-dashed border-2 rounded p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => !selectedFile && fileRef.current?.click()}
            >
                {selectedFile ? null : (
                <div className="text-center">
                    <div className="mb-2">
                    <UploadCloud className="h-8 w-8 mx-auto text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">
                    Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                    PDF, DOC, DOCX (Max 5MB)
                    </p>
                </div>
                )}
            </div>

            <input
                ref={fileRef}
                type="file"
                hidden
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx"
            />
            </div>

          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant='teal' disabled={formState.isSubmitting}>
              {formState.isSubmitting && (
                <LoaderCircle className="animate-spin mr-2" />
              )}
              Submit Proposal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}