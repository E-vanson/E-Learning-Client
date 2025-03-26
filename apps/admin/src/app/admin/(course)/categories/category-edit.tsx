"use client";

import { createCategory, updateCategory, uploadImage } from "@/lib/actions";
import { parseErrorResponse } from "@/lib/parse-error-response";
import { Input } from "@elearning/ui/forms";
import { Button, DialogClose, DialogFooter, useToast } from "@elearning/ui";
import { Category } from "@elearning/lib/models";
import { setStringToSlug } from "@elearning/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Upload, Trash2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";


const schema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, {
    message: "Please enter category name",
  }),
  slug: z.string().min(1, {
    message: "Please enter category slug",
  }),
  cover: z.string().optional(), // Add image field to the schema
});

type CategoryForm = z.infer<typeof schema>;

function CategoryEdit({
  data,
  close,
}: {
  data?: Category;
  close?: () => void;
}) {
  const { toast } = useToast();
  const [isUploading, setUploading] = useState(false);
  const imageFileRef = useRef<HTMLInputElement>(null);

  const {
    control,
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
  } = useForm<CategoryForm>({
    resolver: zodResolver(schema),
    defaultValues: data ?? {
      name: "",
      slug: "",
      cover: "",
    },
  });

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files;
      if (files && files.length > 0) {
        const file = files[0]!;
        const fileSize = file.size / (1024 * 1024);

        if (fileSize > 1) {
          throw "File size too big (max 1MB).";
        }

        setUploading(true);
        const form = new FormData();
        form.append("file", file);
        const url = await uploadImage(form);
        setValue("cover", url);
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

  return (
    <form
      onSubmit={(evt) => {
        evt.preventDefault();
        handleSubmit(async (values) => {
          try {
            if (!values.id) {
              await createCategory(values);
            } else {
              await updateCategory(values);
            }
            close?.();
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
        {/* Image Upload Controller */}
        <div onClick={(e) => e.stopPropagation()}>
          <Controller
          control={control}
          name="cover"
          render={({ field }) => {
            if (field.value) {
              return (
                <div className="relative h-40 w-full rounded-md border border-input bg-background">
                  <Image
                    alt="Category Image"
                    src={field.value}
                    fill
                    sizes="50vw"
                    priority
                    className="object-contain"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-4 right-4 left-auto bottom-auto"
                    onClick={() => setValue("cover", "")}
                  >
                    <Trash2 size={20} />
                  </Button>
                </div>
              );
            }
            return (
              <div className="relative flex h-40 w-full items-center justify-center rounded-md border border-dashed border-input bg-background">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <Button
  variant="link"
  className="font-semibold hover:no-underline"
  disabled={isUploading}
  onClick={(e) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Stop event bubbling
    imageFileRef.current?.click();
  }}
>
  Upload image
  {isUploading ? (
    <LoaderCircle className="ms-2 size-4 animate-spin" />
  ) : (
    <Upload className="size-5 ms-2" />
  )}
</Button>
                  <span className="text-sm text-muted-foreground text-center">
                    PNG or JPG up to 1MB
                  </span>
                </div>
                <input
                  ref={imageFileRef}
                  type="file"
                  accept="image/x-png,image/jpeg"
                  className="hidden"
                  onChange={(e) => {
    e.stopPropagation(); // Add this line
    handleImageUpload(e);
  }}
                />
              </div>
            );
          }}
        />
          
        </div>
        

        <Input
          label="Category"
          id="category"
          type="text"
          wrapperClass="mb-4"
          placeholder="Enter category"
          {...register("name", {
            onChange: (evt) => {
              const slug = setStringToSlug(evt.target.value) ?? "";
              setValue("slug", slug, {
                shouldValidate: !!slug,
              });
            },
          })}
          error={errors.name?.message}
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
                placeholder="Enter slug"
                value={field.value}
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
        <Button type="submit" className="mt-2" disabled={isSubmitting}>
          {isSubmitting && (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          )}
          Save
        </Button>
      </DialogFooter>
    </form>
  );
}

export default CategoryEdit;

// const schema = z.object({
//   id: z.number().optional(),
//   name: z.string().min(1, {
//     message: "Please enter category name",
//   }),
//   slug: z.string().min(1, {
//     message: "Please enter category slug",
//   }),
// });

// type CategoryForm = z.infer<typeof schema>;

// function CategoryEdit({
//   data,
//   close,
// }: {
//   data?: Category;
//   close?: () => void;
// }) {
//   const { toast } = useToast();

//   const {
//     control,
//     register,
//     formState: { errors, isSubmitting },
//     handleSubmit,
//     setValue,
//   } = useForm<CategoryForm>({
//     resolver: zodResolver(schema),
//     defaultValues: data ?? {
//       name: "",
//       slug: "",
//     },
//   });

//   return (
//     <form
//       onSubmit={(evt) => {
//         evt.preventDefault();
//         handleSubmit(async (values) => {
//           try {
//             if (!values.id) {
//               await createCategory(values);
//             } else {
//               await updateCategory(values);
//             }
//             close?.();
//           } catch (error) {
//             toast({
//               title: "Error",
//               description: parseErrorResponse(error),
//               variant: "destructive",
//             });
//           }
//         })();
//       }}
//     >
//       <div className="gird grid-cols-1">
//         <Input
//           label="Category"
//           id="category"
//           type="text"
//           wrapperClass="mb-4"
//           placeholder="Enter category"
//           {...register("name", {
//             onChange: (evt) => {
//               const slug = setStringToSlug(evt.target.value) ?? "";
//               setValue("slug", slug, {
//                 shouldValidate: !!slug,
//               });
//             },
//           })}
//           error={errors.name?.message}
//         />
//         <Controller
//           control={control}
//           name="slug"
//           render={({ field, fieldState: { error } }) => {
//             return (
//               <Input
//                 label="Slug"
//                 id="slug"
//                 type="text"
//                 wrapperClass="mb-4"
//                 placeholder="Enter slug"
//                 value={field.value}
//                 onChange={(evt) => {
//                   const slug = setStringToSlug(evt.target.value) ?? "";
//                   setValue("slug", slug, {
//                     shouldValidate: true,
//                   });
//                 }}
//                 error={error?.message}
//               />
//             );
//           }}
//         />
//       </div>

//       <DialogFooter>
//         <DialogClose asChild>
//           <Button
//             type="button"
//             variant="default"
//             className="mt-2"
//             disabled={isSubmitting}
//           >
//             Cancel
//           </Button>
//         </DialogClose>
//         <Button type="submit" className="mt-2" disabled={isSubmitting}>
//           {isSubmitting && (
//             <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
//           )}
//           Save
//         </Button>
//       </DialogFooter>
//     </form>
//   );
// }

// export default CategoryEdit;


