"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
  Calendar,
} from "@elearning/ui";
import { Controller,  useFieldArray,  useForm } from "react-hook-form";
import { Input, Textarea } from "@elearning/ui/forms";
import { DatePicker } from "@/components/ui/datepicker";
import { LoaderCircle, MoreVertical, FileText } from "lucide-react";
import { Currency, Proposal, ProposalStatus, ContractStatus, Contract } from "@elearning/lib/models";
import { parseErrorResponse } from "@/lib/parse-error-response";
import { updateProposalStatus } from "@/lib/actions/proposal/update-proposal-status";
import { ProposalReviewForm } from "./application-review";
import { createContract } from "@/lib/actions/contract/create-contract";

const contractSchema = z.object({
  terms: z.object({
    scopeOfWork: z.string().min(1, "Scope of work is required"),
    paymentSchedule: z.string().min(1, "Payment schedule is required"),
    terminationClause: z.string().min(1, "Termination clause is required"),
  }),
  startDate: z.date(),
  endDate: z.date(),
  status:z.enum(['draft', 'active', 'terminated', 'completed']),
  paymentCurrency: z.nativeEnum(Currency),  
  paymentAmount: z.number().min(1, "Amount must be positive"),
  milestones: z.array(
    z.object({
      description: z.string().min(1, "Description required"),
      dueDate: z.date(),
      amount: z.number().min(1, "Amount must be positive"),
      completed: z.boolean()
    })
  ).min(1, "At least one milestone required"), 
});

type ContractFormData = z.infer<typeof contractSchema>;

export default function ApplicationActionButtons({ proposal }: { proposal: Proposal }) {
  const { toast } = useToast();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [contractDialogOpen, setContractDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const toggle = (completed:boolean) => {
    completed ? setIsCompleted(false) : setIsCompleted(true);
  }
  
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      terms: {
        scopeOfWork: "",
        paymentSchedule: "",
        terminationClause: "",
      },
      status: "draft",
      startDate: new Date(),
      endDate: new Date(),
      paymentCurrency: Currency.DOLLAR,
      paymentAmount: 1,
      milestones: [{
        description: "",
        dueDate: new Date(),
        amount: 0,
        completed: false,
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
  control,
  name: "milestones"
  });

  const handleStatusChange = async (newStatus: ProposalStatus) => {
    try {      
      await updateProposalStatus(proposal.id, newStatus);
      toast({
        title: "Status updated",
        description: `Proposal status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: parseErrorResponse(error),
        variant: "destructive",
      });
    }
  };

  const handleCreateContract =  async (data: ContractFormData) => {
    console.log("Submit conract button is clicked...", proposal)
    try {
      setIsSubmitting(true);
      const contractPayload: Contract = {
        ...data,
        id: ' ',
        jobId: proposal.job.id.toString(),
        freelancerId: proposal.freelancer.id,
        employerId: proposal.job.employerId.toString(),        
      }
      const isContractCreated = await createContract(contractPayload);
      if (isContractCreated) {
        toast({ title: "Contract created successfully", variant: "success" });
        setContractDialogOpen(false);
        reset();
      } else {
        toast({
        title: "Error creating contract",        
        variant: "destructive",
      });
      }      
      
    } catch (error) {
      console.log("The error: ", error)
      toast({
        title: "Error creating contract",
        description: parseErrorResponse(error),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex gap-2">
      {/* Status Dropdown */}
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleStatusChange("pending")}>
            Mark as Pending
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange("accepted")}>
            Mark as Accepted
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange("rejected")}>
            Mark as Rejected
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
      <ProposalReviewForm
        proposal={proposal}        
      />

      {/* Create Contract Button */}
      {proposal.status === "accepted" && (
        <Button
          variant='secondary'
          size="sm"
          onClick={() => setContractDialogOpen(true)}
        >
          <FileText className="mr-2 h-4 w-4" />
          Create Contract
        </Button>
      )}

      {/* Contract Creation Dialog */}
      <Dialog open={contractDialogOpen} onOpenChange={setContractDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Contract</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(handleCreateContract, (errors) => console.error("Form errors:", errors))} className="space-y-4">
            {/* Terms Section */}
            <div className="space-y-2">
              <label className="font-medium">Scope of Work</label>            
              <Textarea {...register("terms.scopeOfWork")} />
              {errors.terms?.scopeOfWork && (
                <p className="text-red-500 text-sm">{errors.terms.scopeOfWork.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="font-medium">Payment Schedule</label>              
              <Textarea {...register("terms.paymentSchedule")} />
              {errors.terms?.paymentSchedule && (
                <p className="text-red-500 text-sm">{errors.terms.paymentSchedule.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="font-medium">Termination Clause</label>              
              <Textarea {...register("terms.terminationClause")} />
              {errors.terms?.terminationClause && (
                <p className="text-red-500 text-sm">{errors.terms.terminationClause.message}</p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-medium">Start Date</label>  
                <Input                  
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  {...register("startDate", { valueAsDate: true })}
                  error={errors.startDate?.message}
                />                
              </div>

              <div className="space-y-2">
                <label className="font-medium">End Date</label>
                <Input                  
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  {...register("endDate", { valueAsDate: true })}
                  error={errors.endDate?.message}
                />                
              </div>
            </div>

            {/* Payment Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-medium">Payment Amount</label>
                <Input
                  type="number"
                  {...register("paymentAmount", { valueAsNumber: true })}
                />
                {errors.paymentAmount && (
                  <p className="text-red-500 text-sm">{errors.paymentAmount.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="font-medium">Currency</label>
                <Select {...register("paymentCurrency")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Currency).map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Milestones */}
            <div className="space-y-4">
              <label className="font-medium">Milestones</label>
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-2 border p-4 rounded">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-medium">Description</label>
                      <Input
                        {...register(`milestones.${index}.description`)}
                      />
                    </div>
                    <div>
                      <label className="font-medium">Due Date</label>
                      <Input                                                
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        {...register(`milestones.${index}.dueDate`, { valueAsDate: true })}
                        error={errors.milestones?.message}
                      />
                      {/* <Controller
                        name={`milestones.${index}.dueDate`}
                        control={control}
                        render={({ field }) => (
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                          />
                        )}
                      /> */}
                    </div>
                  </div>
                  <div>
                    <label className="font-medium">Amount</label>
                    <Input
                      type="number"
                      {...register(`milestones.${index}.amount`, { valueAsNumber: true })}
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Controller
                      name={`milestones.${index}.completed`}
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id={`completed-${index}`}
                          className="rounded"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <label
                      htmlFor={`completed-${index}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {field.completed ? "Unmark completed" : "Mark as completed"}
                    </label>
                  </div>
    
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ description: "", dueDate: new Date(), amount: 0, completed: false })}
              >
                Add Milestone
              </Button>
            </div>

            {/* Status */}
            <div className="space-y-4">
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
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">active</SelectItem>
                      <SelectItem value="completed">completed</SelectItem>
                      <SelectItem value="terminated">terminated</SelectItem>
                      </SelectContent>
                  </Select>
                  )}
                />
                {errors.status && (
                  <p className="text-red-500 text-sm">{errors.status.message}</p>
                )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setContractDialogOpen(false);
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                Create Contract
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}