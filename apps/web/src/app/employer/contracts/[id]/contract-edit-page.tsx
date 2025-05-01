"use client";

import { updateContract } from "@/lib/actions/contract/update-contract";
import { parseErrorResponse } from "@/lib/parse-error-response";
import { useAppSelector } from "@elearning/global-store";
import { selectUser } from "@elearning/global-store/slices";
import { Contract, ContractStatus, Currency } from "@elearning/lib/models";
import { cn, debounce, formatTimestamp, setStringToSlug, uppercaseFirstChar } from "@elearning/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Calendar,
  Checkbox,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useToast,
} from "@elearning/ui";
import {
  Input,
  ReactSelect,
  Select,
  Textarea,
} from "@elearning/ui/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarIcon,
  Cloud,
  CloudUpload,
  LoaderCircle,
  PanelRight,
  Settings,
  Settings2Icon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import ContractDeleteButton from "./contract-delete-button";

const contractSchema = z.object({
  terms: z.object({
    scopeOfWork: z.string().min(1, "Scope of work is required"),
    paymentSchedule: z.string().min(1, "Payment schedule is required"),
    terminationClause: z.string().min(1, "Termination clause is required"),
  }),
  startDate: z.date(),
  endDate: z.date(),
  status: z.enum(['draft', 'active', 'terminated', 'completed']),
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

type ContractEditForm = z.infer<typeof contractSchema>;

interface ContractEditPageProps {
  contract: Contract;
}

export default function ContractEditPage({ contract }: ContractEditPageProps) {
  const user = useAppSelector(selectUser);
  const { toast } = useToast();
  const [isOpenSettings, setOpenSettings] = useState(false);
  const [isStale, setStale] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const updateTime = new Date();

  const { control, register, formState: { errors }, setValue, getValues, handleSubmit } = useForm<ContractEditForm>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      terms: contract.terms,
      startDate: new Date(contract.startDate),
      endDate: new Date(contract.endDate),
      status: contract.status,
      paymentCurrency: contract.paymentCurrency,
      paymentAmount: Number(contract.paymentAmount),
      milestones: contract.milestones.map(m => ({
        ...m,
        dueDate: new Date(m.dueDate)
      }))
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "milestones"
  });

  const handleUpdate = async () => {
    try {
      setSaving(true);
      setStale(false);
      
      const values = getValues();
      const result = await updateContract({
        ...values,
        id: contract.id,
        paymentAmount: Number(contract.paymentAmount), 
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        milestones: values.milestones.map(m => ({
          ...m,
          dueDate: m.dueDate.toISOString()
        })),
        updatedAt:updateTime.toISOString()
      });    
        
        if (result) {
            toast({
            title: "Success",
            description: "Contract updated successfully",
            variant: "success",
        });
        } else {
            toast({
            title: "Failed",
            description: "Contract Failed To Update",
            variant: "destructive",
        });
        }

      
      setSaving(false);
    } catch (error) {
      toast({
        title: "Error",
        description: parseErrorResponse(error),
        variant: "destructive",
      });
      setSaving(false);
      setStale(true);
    }
  };

  const debouncedUpdate = debounce(() => handleUpdate(), 2000);

  const saveStateView = () => {
    if (isSaving) {
      return <LoaderCircle className="flex-shrink-0 animate-spin text-muted-foreground" />;
    }
    if (isStale) {
      return <CloudUpload className="flex-shrink-0 text-muted-foreground" />;
    }
    return <Cloud className="flex-shrink-0 text-success" />;
  };

  if (!user) return null;

  return (
    <div className="flex flex-col relative">
      <nav className="flex gap-3 items-center fixed top-0 inset-x-0 bg-background px-4 h-[65px] border-b z-[100] shadow-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/employer/contracts">Contracts</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {contract.id.slice(0, 8)}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex-1"></div>
        {saveStateView()}

        <Button 
          variant="teal" 
          disabled={isSaving} 
          onClick={handleUpdate}
          className="mr-2"
        >
          {isSaving && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setOpenSettings(!isOpenSettings)}
              >
                <Settings size={22} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Contract settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>

      <div className="grow mt-[65px]">
        <div className="container max-w-3xl 2xl:max-w-4xl mt-7 mb-16">
          <div className="mb-6">
            <Controller
              control={control}
              name="terms.scopeOfWork"
              render={({ field }) => (
                <Textarea
                  label="Scope of Work"
                  placeholder="Describe the scope of work"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    debouncedUpdate();
                  }}
                  error={errors.terms?.scopeOfWork?.message}
                  rows={4}
                />
              )}
            />
          </div>

          <Controller
            control={control}
            name="terms.paymentSchedule"
            render={({ field }) => (
              <Textarea
                label="Payment Schedule"
                placeholder="Describe payment terms"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  debouncedUpdate();
                }}
                error={errors.terms?.paymentSchedule?.message}
                rows={4}
              />
            )}
          />

          <Controller
            control={control}
            name="terms.terminationClause"
            render={({ field }) => (
              <Textarea
                label="Termination Clause"
                placeholder="Describe termination terms"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  debouncedUpdate();
                }}
                error={errors.terms?.terminationClause?.message}
                rows={4}
              />
            )}
          />
        </div>
      </div>

      {/* Settings Panel */}
      <div className={cn(
        "flex flex-col fixed bg-background border-l inset-y-0 right-0 w-full min-w-[100px] max-w-[400px] z-50 h-screen",
        "transition-transform ease-out",
        `${isOpenSettings ? "translate-x-0" : "translate-x-[400px]"}`
      )}>
        <div className="flex items-center gap-2 px-4 h-[65px] border-b shrink-0">
          <h4>Contract Settings</h4>
          <button
            className="ms-auto"
            onClick={() => setOpenSettings(false)}
          >
            <XIcon className="text-muted-foreground" />
          </button>
        </div> 
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="p-4 space-y-4 pb-8">
            <div className="grid grid-cols-2 gap-4">
              <Controller
                control={control}
                name="startDate"
                render={({ field }) => (
                  <Popover>
                    <div className="flex flex-col gap-2">
                      <label>Start Date</label>
                      <PopoverTrigger asChild>
                        <Button variant="outline">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? formatTimestamp(field.value.getTime()) : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </div>
                  </Popover>
                )}
              />

              <Controller
                control={control}
                name="endDate"
                render={({ field }) => (
                  <Popover>
                    <div className="flex flex-col gap-2">
                      <label>End Date</label>
                      <PopoverTrigger asChild>
                        <Button variant="outline">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? formatTimestamp(field.value.getTime()) : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </div>
                  </Popover>
                )}
              />
            </div>

            <Controller
                control={control}
                name="paymentAmount"
                render={({ field }) => (
                    <Input
                    label="Payment Amount"
                    type="number"
                    min="1"
                    step="0.01"
                    value={field.value}
                    onChange={(e) => {
                        // Convert to number and handle empty/NaN cases
                        const value = Math.max(1, Number(e.target.value) || 1);
                        field.onChange(value);
                        debouncedUpdate();
                    }}
                    onBlur={(e) => {
                        // Final cleanup of the value
                        const value = Math.max(1, Number(e.target.value) || 1);
                        field.onChange(value);
                    }}
                    error={errors.paymentAmount?.message}
                    />
                )}
            />

            <Controller
              control={control}
              name="paymentCurrency"
              render={({ field }) => (
                <Select
                  label="Currency"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value as Currency);
                    debouncedUpdate();
                  }}
                >
                  {Object.values(Currency).map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </Select>
              )}
            />

            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  label="Contract Status"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value as ContractStatus);
                    debouncedUpdate();
                  }}
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="terminated">Terminated</option>
                  <option value="completed">Completed</option>
                </Select>
              )}
            />

            <div className="space-y-4">
              <h4 className="font-medium">Milestones</h4>
              {fields.map((field, index) => (
                <div key={field.id} className="border p-4 rounded space-y-4">
                  <Controller
                    name={`milestones.${index}.description`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Description"
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.milestones?.[index]?.description?.message}
                      />
                    )}
                  />

                  <Controller
                    name={`milestones.${index}.dueDate`}
                    control={control}
                    render={({ field }) => (
                      <Popover>
                        <div className="flex flex-col gap-2">
                          <label>Due Date</label>
                          <PopoverTrigger asChild>
                            <Button variant="outline">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? formatTimestamp(field.value.getTime()) : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </div>
                      </Popover>
                    )}
                  />

                  <Controller
                    name={`milestones.${index}.amount`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Amount"
                        type="number"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        error={errors.milestones?.[index]?.amount?.message}
                      />
                    )}
                  />
                  <>
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
                   </> 
                  

                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    Remove Milestone
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => append({
                  description: "",
                  dueDate: new Date(),
                  amount: 0,
                  completed: false
                })}
              >
                Add Milestone
              </Button>
            </div>

            <ContractDeleteButton contract={contract} />
          </div>          
        </div>
      </div>
    </div>
  );
}