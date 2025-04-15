"use client";

import { createJob } from "@/lib/actions/jobs/create-job";
import { parseErrorResponse } from "@/lib/parse-error-response";
import { useAppSelector } from "@elearning/global-store";
import { selectUser } from "@elearning/global-store/slices";
import { setStringToSlug } from "@elearning/lib/utils";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  useToast,
} from "@elearning/ui";
import { Input, Select } from "@elearning/ui/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { BudgetType, ExperienceLevel, JobStatus } from "@elearning/lib/models";

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

type JobForm = z.infer<typeof schema>;

export default function JobCreateButton() {
  const user = useAppSelector(selectUser);
  const { toast } = useToast();
  const [isOpen, setOpen] = useState(false);

  const {
    control,
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
    reset,
  } = useForm<JobForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      slug: "",      
      budget: 100,
      budgetType: "fixed",
      deadline: new Date(),
      experienceLevel: "intermediate",
      status: "draft",
      skillsRequired: [],
    },
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(op) => {
        setOpen(op);
        reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="teal" color="teal">New Job</Button>
      </DialogTrigger>

      <DialogContent onInteractOutside={(evt) => evt.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Create Job</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(evt) => {
            evt.preventDefault();
            handleSubmit(async (values) => {
              try {
                await createJob({
                  ...values                 
                });
                setOpen(false);
              } catch (error) {
                toast({
                  title: "Error",
                  description: parseErrorResponse(error),
                  variant: "destructive",
                });
              }
            })();
          }}
        >
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Title"
              type="text"
              placeholder="Enter job title"
              {...register("title", {
                onChange: (evt) => {
                  const slug = setStringToSlug(evt.target.value) ?? "";
                  setValue("slug", slug, { shouldValidate: !!slug });
                },
              })}
              error={errors.title?.message}
            />

            <Input
              label="Description"
              type="textarea"
              placeholder="Enter job description"
              {...register("description")}
              error={errors.description?.message}
            />

            <Controller
              control={control}
              name="slug"
              render={({ field, fieldState: { error } }) => (
                <Input
                  label="Slug"
                  type="text"
                  placeholder="Enter job slug"
                  value={field.value}
                  onChange={(evt) => {
                    const slug = setStringToSlug(evt.target.value) ?? "";
                    setValue("slug", slug, { shouldValidate: true });
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
                  label="Skills (comma-separated)"
                  placeholder="e.g., React, Node.js, TypeScript"
                  value={Array.isArray(field.value) 
                    ? field.value.join(', ') 
                    : ''}
                  onChange={(e) => {
                    const values = e.target.value
                      .split(',')
                      .map(s => s.trim())
                      .filter(Boolean);
                    
                    // Directly update the field value
                    field.onChange(values);
                  }}
                  error={error?.message}
                />
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Budget"
                type="number"
                min="1"
                step="1"
                {...register("budget", { valueAsNumber: true })}
                error={errors.budget?.message}
              />

              <Controller
                control={control}
                name="budgetType"
                render={({ field, fieldState: { error } }) => (
                <Select
                    label="Budget Type"
                    {...field}
                    error={error?.message}
                >
                    <option value="fixed">Fixed Price</option>
                    <option value="hourly">Hourly Rate</option>
                </Select>
                )}
            />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Deadline"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                {...register("deadline", { valueAsDate: true })}
                error={errors.deadline?.message}
              />

              <Controller
                control={control}
                name="experienceLevel"
                render={({ field, fieldState: { error } }) => (
                <Select
                    label="Experience Level"
                    {...field}
                    error={error?.message}
                >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="experienced">Experienced</option>
                </Select>
                )}
            />
            </div>
            <Controller
                control={control}
                name="status"
                render={({ field, fieldState: { error } }) => (
                    <Select
                    label="Status"
                    {...field}
                    error={error?.message}
                    >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                    </Select>
                )}
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
              Create Job
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}