"use client";

import { updateJob } from "@/lib/actions/job/update-job";
import { BASE_URL } from "@/lib/constants";
import { parseErrorResponse } from "@/lib/parse-error-response";
import { useAppSelector } from "@elearning/global-store";
import { selectUser } from "@elearning/global-store/slices";
import { Job, BudgetType, ExperienceLevel, JobStatus } from "@elearning/lib/models";
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
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import JobDeleteButton from "./job-delete-button";

const schema = z.object({
  title: z.string().min(1, { message: "Please enter job title" }),
  description: z.string().min(1, { message: "Please enter job description" }),
  slug: z.string().min(1, { message: "Please enter job slug" }), 
  skillsRequired: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        return val.split(',').map(s => s.trim()).filter(Boolean);
      }
      if (Array.isArray(val)) return val;
      return [];
    },
    z.array(z.string().min(1)).min(1, {
      message: "Please enter at least one skill (comma-separated)",
    })
  ),
  budget: z.number().min(1, { message: "Budget must be at least 1" }),
  budgetType: z.custom<BudgetType>(val => 
    typeof val === "string" ? ["fixed", "hourly"].includes(val) : false
  ),
  deadline: z.date().min(new Date(), { message: "Deadline must be in the future" }),
  experienceLevel: z.custom<ExperienceLevel>(val =>
    typeof val === "string" ? ["beginner", "intermediate", "experienced"].includes(val) : false
  ),
  status: z.custom<JobStatus>(val =>
    typeof val === "string" ? ["active", "draft", "closed"].includes(val) : false
  ),
});

type JobEditForm = z.infer<typeof schema>;

interface JobEditPageProps {
  job: Job;
}

export default function JobEditPage({ job }: JobEditPageProps) {
  const user = useAppSelector(selectUser);
  const { toast } = useToast();
  const [isOpenSettings, setOpenSettings] = useState(false);
  const [isStale, setStale] = useState(false);
  const [isSaving, setSaving] = useState(false);

  const { control, register, formState: { errors }, setValue, getValues } = useForm<JobEditForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...job,
      deadline: new Date(job.deadline),
      skillsRequired: job.skillsRequired
    }
  });

  const handleUpdate = async () => {
    try {
      setSaving(true);
      setStale(false);
      
      const values = getValues();
      const result = await updateJob({
        ...values,
        id: job.id,
        deadline: values.deadline.toISOString()
      });    

      toast({
        title: "Success",
        description: "Job updated successfully",
        variant: "success",
      });

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

  const debouncedUpdate = debounce(handleUpdate, 2000);

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
                <Link href="/admin/jobs">Jobs</Link>
            </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
            <BreadcrumbPage>
                {uppercaseFirstChar(job.slug)}
            </BreadcrumbPage>
            </BreadcrumbItem>
        </BreadcrumbList>
        </Breadcrumb>
        <div className="flex-1"></div>
        {saveStateView()}

        {/* Save Button - Added margin */}
        <Button 
        variant="teal" 
        disabled={isSaving} 
        onClick={handleUpdate}
        className="mr-2"
        >
        {isSaving && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
        Save Changes
        </Button>

        {/* Settings Button - Changed variant for better visibility */}
        <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
            <Button
                variant="outline"
                size="icon"
                onClick={() => setOpenSettings(!isOpenSettings)}
            >
                <PanelRight size={22} />
            </Button>
            </TooltipTrigger>
            <TooltipContent>Job settings</TooltipContent>
        </Tooltip>
        </TooltipProvider>
    </nav>

      <div className="grow mt-[65px]">
        <div className="container max-w-3xl 2xl:max-w-4xl mt-7 mb-16">
          <div className="mb-6">
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <Input
                  label="Job Title"
                  placeholder="Enter job title"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    const slug = setStringToSlug(e.target.value);
                    setValue("slug", slug);
                    debouncedUpdate(slug);
                  }}
                  error={errors.title?.message}
                />
              )}
            />
          </div>

          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <Textarea
                label="Job Description"
                placeholder="Detailed job description"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  debouncedUpdate(e);
                }}
                rows={8}
                error={errors.description?.message}
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
          <h4>Job Settings</h4>
          <button
            className="ms-auto"
            onClick={() => setOpenSettings(false)}
          >
            <XIcon className="text-muted-foreground" />
          </button>
        </div> 
        <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-4 space-y-4 pb-8">
          <Controller
            control={control}
            name="slug"
            render={({ field, fieldState: { error } }) => (
              <Input
                label="Slug"
                value={field.value}
                onChange={(e) => {
                  field.onChange(setStringToSlug(e.target.value));
                  debouncedUpdate(e);
                }}
                error={error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="skillsRequired"
            render={({ field, fieldState: { error } }) => (
              <Input
                label="Required Skills (comma-separated)"
                value={field.value?.join(', ')}
                onChange={(e) => {
                  const values = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                  field.onChange(values);
                  debouncedUpdate(e);
                }}
                error={error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="budget"
            render={({ field, fieldState: { error } }) => (
              <Input
                label="Budget"
                type="number"
                value={field.value}
                onChange={(e) => {
                  field.onChange(Number(e.target.value));
                  debouncedUpdate(e);
                }}
                error={error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="budgetType"
            render={({ field }) => (
              <Select
                label="Budget Type"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value as BudgetType);
                  debouncedUpdate(e);
                }}
              >
                <option value="fixed">Fixed</option>
                <option value="hourly">Hourly</option>
              </Select>
            )}
          />

          <Controller
            control={control}
            name="deadline"
            render={({ field }) => (
              <Popover>
                <div className="flex flex-col gap-2">
                  <label>Deadline</label>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? formatTimestamp(field.value.getTime()) : "Select deadline"}
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
            name="experienceLevel"
            render={({ field }) => (
              <Select
                label="Experience Level"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value as ExperienceLevel);
                  debouncedUpdate(e);
                }}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="experienced">Experienced</option>
              </Select>
            )}
          />

          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select
                label="Job Status"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value as JobStatus);
                  debouncedUpdate(e);
                }}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </Select>
            )}
          />

          <JobDeleteButton job={job} />
        </div>          
        </div>
        
      </div>
    </div>
  );
}