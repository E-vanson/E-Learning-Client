import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenu,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
  Calendar,
} from "@elearning/ui";
import { Input, Textarea } from "@elearning/ui/forms";
import { LoaderCircle, MessageSquare, CheckCircle } from "lucide-react";
import { Proposal, ProposalReview } from "@elearning/lib/models";
import { reviewProposal } from "@/lib/actions/proposal/review-proposal";
import { parseErrorResponse } from "@/lib/parse-error-response";

const reviewSchema = z.object({
  status: z.enum(["pending", "accepted", "rejected"]),
  employerFeedback: z.string().min(1, "Feedback is required"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

export function ProposalReviewForm({ 
  proposal
}: { 
  proposal: Proposal;
}) {
  const { toast } = useToast();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit,control, formState: { errors }, reset } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      status: proposal.status,
      employerFeedback: ""
    }
  });

  const submitReview = async (data: ReviewFormData) => {
    try {
      setIsSubmitting(true);
      const reviewPayload: ProposalReview = {
        ...data,
        reviewedAt: new Date(),
        reviewedBy: proposal.id.toString(),
      };
      
      await reviewProposal(proposal.id, reviewPayload);
      
      toast({
        title: "Review submitted",
        description: "Proposal status and feedback updated",
        variant: "success"
      });
      setDialogOpen(false);
      reset();
    } catch (error) {
      toast({
        title: "Update failed",
        description: parseErrorResponse(error),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setDialogOpen(true)}
        className="gap-2"
      >
        <MessageSquare className="h-4 w-4" />
        Review Proposal
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Proposal</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(submitReview)} className="space-y-4">
            <div className="space-y-2">
              <label className="font-medium">Status</label>            
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                >
                    <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
                )}
              />
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="font-medium">Feedback</label>            
              <Textarea
                {...register("employerFeedback")}
                placeholder="Provide feedback for the freelancer..."
              />
              {errors.employerFeedback && (
                <p className="text-red-500 text-sm">{errors.employerFeedback.message}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                Submit Review
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}