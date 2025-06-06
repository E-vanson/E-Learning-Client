"use client";

import { createCourse } from "@/lib/actions";
import { parseErrorResponse } from "@/lib/parse-error-response";
import { useAppSelector } from "@elearning/global-store";
import { selectUser } from "@elearning/global-store/slices";
import { Category, CourseLevel, User } from "@elearning/lib/models";
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
import { Input, ReactSelect, Select } from "@elearning/ui/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, {
    message: "Please enter course name",
  }),
  slug: z.string().min(1, {
    message: "Please enter course slug",
  }),
  level: z.custom<CourseLevel>((v) => {
    return typeof v === "string"
      ? /beginner|intermediate|advanced/.test(v)
      : false;
  }),
  category: z
    .custom<Category>()
    .refine((v) => !!v, { message: "Required course category" }),
  authors: z.custom<User>().array().min(1, {
    message: "Required at least one author",
  }),
});

type CourseForm = z.infer<typeof schema>;

export default function CourseCreateButton({
  categories,
}: {
  categories: Category[];
}) {
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
  } = useForm<CourseForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      slug: "",
      authors: user?.id ? [user] : [],
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
        <Button variant= "teal" color="teal">New course</Button>
      </DialogTrigger>

      <DialogContent
        className="top-[25%]"
        onInteractOutside={(evt) => evt.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Create Course</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(evt) => {
            evt.preventDefault();
            handleSubmit(async (values) => {
              try {
                const { category, authors, ...props } = values;
                await createCourse({
                  ...props,
                  categoryId: category.id,
                  authors: authors.map((a) => a.id),
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
          <div className="gird grid-cols-1">
            <Input
              label="Title"
              type="text"
              wrapperClass="mb-4"
              placeholder="Enter course title"
              {...register("title", {
                onChange: (evt) => {
                  const slug = setStringToSlug(evt.target.value) ?? "";
                  setValue("slug", slug, {
                    shouldValidate: !!slug,
                  });
                },
              })}
              error={errors.title?.message}
            />
            <Controller
              control={control}
              name="slug"
              render={({ field, fieldState: { error } }) => {
                return (
                  <Input
                    label="Slug"
                    id="slug"
                    type="text"
                    wrapperClass="mb-4"
                    placeholder="Enter course slug"
                    value={field.value ?? ""}
                    onChange={(evt) => {
                      const slug = setStringToSlug(evt.target.value) ?? "";
                      setValue("slug", slug, {
                        shouldValidate: true,
                      });
                    }}
                    error={error?.message}
                  />
                );
              }}
            />

            <Select
              label="Level"
              wrapperClass="mb-4"
              {...register("level")}
              error={errors.level?.message}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </Select>

            <Controller
              control={control}
              name="category"
              render={({ field, fieldState: { error } }) => {
                return (
                  <ReactSelect<Category>
                    label="Category"
                    wrapperClass="mb-4"
                    value={field.value}
                    options={categories}
                    getOptionLabel={(op) => op.name}
                    getOptionValue={(op) => `${op.id}`}
                    onChange={(newValue, action) => {
                      newValue && setValue("category", newValue);
                    }}
                    error={error?.message}
                    isClearable={false}
                  />
                );
              }}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="default"
                className="mt-2"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant='teal' className="mt-2" disabled={isSubmitting}>
              {isSubmitting && (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              )}
              Continue
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
