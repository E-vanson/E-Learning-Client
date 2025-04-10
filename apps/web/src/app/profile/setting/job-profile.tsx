"use client";


import { firebaseAuth } from "@/lib/firebase.config";
import { updateUserEmployerProfile } from "@/lib/actions/user/update-employer-profile";
import { updateUserFreelancerProfile } from "@/lib/actions/user/update-freelancer-profile";
import { createUserJobProfile } from "@/lib/actions/user/create-job-profile";
import { parseErrorResponse } from "@/lib/parse-error-response";
import { Input } from "@elearning/ui/forms";
import { Button, ProfileAvatar, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Separator, useToast } from "@elearning/ui";
import { User, EmployerProfile, Freelancer, PortfolioLinks, UserJobRole } from "@elearning/lib/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { ChangeEvent, useRef, useState, useEffect } from "react";
import { useForm, useFieldArray, FieldErrors } from "react-hook-form";
import { z } from "zod";
import { getFreelancerProfile } from "@/lib/actions/job-application/get-freelancer";
import { getEmployerData } from "@/lib/actions/job-application/get-employer";

const baseSchema = z.object({
  profileType: z.enum(["employer", "freelancer"])
});

const employerSchema = baseSchema.extend({
  profileType: z.literal("employer"),
  companyName: z.string().min(1, "Company name is required"),
  companyDescription: z.string().optional(),
  website: z.string().url("Invalid website URL").optional()
});

const freelancerSchema = baseSchema.extend({
  profileType: z.literal("freelancer"),
  headline: z.string().optional(),
  overview: z.string()
    .min(50, "Overview should be at least 50 characters")
    .max(2000, "Overview should be less than 2000 characters"),
  hourlyRate: z.number()
    .min(10, "Minimum hourly rate is $10")
    .max(500, "Maximum hourly rate is $500"),
  skills: z.array(z.string().min(1, "Skill cannot be empty"))
    .max(10, "Maximum 10 skills allowed")
    .optional()
    .default([]), // Add default empty array
  portfolioLinks: z.array(
    z.object({
      platform: z.string().min(1, "Platform is required"),
      url: z.string().url("Invalid URL")
    })
  ).optional()
});

type FormData = z.infer<typeof employerSchema | typeof freelancerSchema>;

type ProfileType = "employer" | "freelancer" | "user";

type PortfolioLinkField = PortfolioLinks & { id: string };

type EmployerFormType = {
  profileType: "employer";
  companyName: string;
  companyDescription?: string;
  website?: string;
};

type FreelancerFormType = {
  profileType: "freelancer";
  overview: string;
  hourlyRate: number;
  skills: string[];
  headline?: string;
  portfolioLinks?: PortfolioLinks[];
};

export default function JobProfile({ user }: { user: User }) {
  const { toast } = useToast();
  const [profileType, setProfileType] = useState<ProfileType>('user');
  const [profile, setProfile] = useState<EmployerProfile | Freelancer | null>(null);
  const [existingProfile, setExistingProfile] = useState<EmployerProfile | Freelancer | null>(null);
  const [freelancerProfile, setFreelancerProfile] = useState<Freelancer | null>(null);
  const [employerProfile, setEmployerProfile] = useState<EmployerProfile | null>(null);
  const [loading, setLoading] = useState(true);  
  const freelancer: Freelancer = {
    id: '',
    userId: user.id,
    headline: '',
    portfolioLinks: [],
    overview: '',
    skills: [],
    hourlyRate: 0
  }
  const employer: EmployerProfile = {
    id: '',
    userId: user.id,
    companyDescription: '',
    companyName: '',
    website: ''
  }

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    trigger
  } = useForm<FormData>({
    resolver: zodResolver(user.jobRole === "employer" ? employerSchema : freelancerSchema),
    mode: "onBlur",
    defaultValues: {
      profileType: user.jobRole === "employer" ? "employer" : user.jobRole === "freelancer" ? "freelancer" : undefined,
      skills: []      
    },
    shouldUnregister: true
  });
  
  const profileTypee = watch("profileType");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "portfolioLinks"
  });  

  const isFreelancer = watch('profileType') === 'freelancer';

  const freelancerErrors = isFreelancer
    ? (errors as FieldErrors<FreelancerFormType>)
    : undefined;

  const employerErrors = !isFreelancer
    ? (errors as FieldErrors<EmployerFormType>)
    : undefined;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (user.jobRole === "freelancer") {
          const data = await getFreelancerProfile(user.id);  
          setFreelancerProfile(data);          
          setProfileType("freelancer");
        } else if (user.jobRole === "employer") {
          const data = await getEmployerData(user.id);          
          setEmployerProfile(data);          
          setProfileType("employer");
        } else {
          setExistingProfile(profile)
        }
      } catch (error) {
        toast({ variant: "destructive", title: "Error loading profile" });
      } finally {
        setLoading(false);
      }
    };

    if (user.jobRole !== "user") {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
  if (profileType) {
    trigger(); // Trigger validation when profileType changes
  }
}, [profileType, trigger]);

  useEffect(() => {
    if (freelancerProfile?.portfolioLinks) {
      freelancerProfile.portfolioLinks.forEach(link => {
        append(link);
      });
    }
  }, [freelancerProfile, append]);

  // const populateForm = (profile: EmployerProfile | Freelancer) => {
  //   if (isEmployer(profile)) {
  //     setValue('companyName', profile.companyName || '');
  //     setValue('companyDescription', profile.companyDescription || '');
  //     setValue('website', profile.website || '');
  //   } else {
  //     setValue('headline', profile.headline || '');
  //     setValue('overview', profile.overview || '');
  //     setValue('hourlyRate', profile.hourlyRate || 0);
  //     setValue('skills', (profile.skills || []).join(', '));
  //   }
  // };

  // const createUserRole = (role: UserJobRole) => {
  //   if (role === 'freelancer') {
  //     setProfile(freelancer);
  //   }else{
  //     setProfile(employer);
  //   }

  // }

  const handleRoleSelection = async (selectedType: "employer" | "freelancer") => {
    try {
      //  createUserRole(selectedType);
      setProfileType(selectedType);
      if (selectedType === "freelancer") {
        setFreelancerProfile({ ...freelancer, userId: user.id });
      } else {
        setEmployerProfile({ ...employer, userId: user.id });
      }
      toast({ variant: "success", title: "Profile type created!" });
    } catch (error) {
      toast({ variant: "destructive", title: parseErrorResponse(error) });
    }
  };

  // const handleProfileUpdate = async (data: any) => {
  //   try {
  //     if (profileType === "employer") {
  //       await updateUserEmployerProfile({
  //         ...data,
  //         userId: user.id,
  //         id: employerProfile?.id,
  //       });
  //     } else {
  //       await updateUserFreelancerProfile({
  //         ...data,
  //         userId: user.id,
  //         id: freelancerProfile?.id,
  //       });
  //     }
  //     toast({ variant: "success", title: "Profile updated successfully!" });
  //   } catch (error) {
  //     toast({ variant: "destructive", title: parseErrorResponse(error) });
  //   }
  // };

  const handleProfileUpdate = async (data: FormData) => {
    console.log("Inside profile upate: ..")
    try {
      console.log("Inside profile upate: ..")
      if (profileType === "employer")  {
        if (employerProfile?.id) {
          // Update existing profile
          const updated = await updateUserEmployerProfile({
            id: employerProfile.id,
            ...data
          });
          setEmployerProfile(updated);
        }
        else {
          // Create new profile
          const result = await createUserJobProfile("employer", data);
          setEmployerProfile(result);
        }
      } else if (profileType === "freelancer") {
        if (freelancerProfile?.id) {
          // Update existing profile
          const updated = await updateUserFreelancerProfile({
            id: freelancerProfile.id,
            ...data
          });
          setFreelancerProfile(updated);

        }
        else {
          // Create new profile
          const result = await createUserJobProfile("freelancer", data);
          setFreelancerProfile(result);
        }
      }
      
      toast({ variant: "success", title: "Profile updated successfully!" });
    } catch (error) {
      toast({ variant: "destructive", title: parseErrorResponse(error) });
    }
  };

  function isEmployer(profile: EmployerProfile | Freelancer): profile is EmployerProfile {
    return 'companyName' in profile;    
  }  

  console.log("Current user job role: ", user.jobRole, profileType);


  if (loading) return <LoaderCircle className="animate-spin" />;

  return (
    <form onSubmit={handleSubmit(handleProfileUpdate, (errors) => {
      console.log("Form errors:", errors);
      toast({
        variant: "destructive",
        title: "Validation errors",
        description: "Please check the form fields"
      });
    })}
    >
      {user.jobRole === "user" ? (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Create Professional Profile</h2>
          <Select
            onValueChange={value => {
              setValue("profileType", value as "employer" | "freelancer")
              handleRoleSelection(value as "freelancer" | "employer")
            }}
            value={profileType}
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select profile type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="freelancer">Freelancer Profile</SelectItem>
              <SelectItem value="employer">Employer Profile</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : null}

      {profileType === "employer" ? (
        <div className="space-y-4">
          <Input
            label="Company Name"
            {...register("companyName")}
            error={employerErrors?.companyName?.message}
          />
          <Input
            label="Company Description"
            type="textarea"
            {...register("companyDescription")}
            error={employerErrors?.companyDescription?.message}
          />
          <Input
            label="Website"
            {...register("website")}
            error={employerErrors?.website?.message}
          />
        </div>
      ) : profileType === "freelancer" ? (
        <div className="space-y-4 mt-4">
          <Input
            label="Headline"
              {...register("headline")}
              defaultValue={freelancerProfile?.headline}
              error={freelancerErrors?.headline?.message}
          />
          <Input
            label="Overview"
            type="textarea"            
            {...register("overview")}
            defaultValue={freelancerProfile?.overview}
            error={freelancerErrors?.overview?.message}
            minLength={50}  // Add HTML validation
          />
          <Input
            label="Hourly Rate ($)"
            type="number"
            {...register("hourlyRate", { valueAsNumber: true })}
            defaultValue={freelancerProfile?.hourlyRate}
            error={freelancerErrors?.hourlyRate?.message}
          />

          <div className="space-y-2">
          <Input
          type="text" // Fix typo ("tet" -> "text")
          label="Skills"
          {...register("skills", {
            setValueAs: (value: unknown) => {
              if (typeof value !== "string") {
                if (Array.isArray(value)) return value;
                return [];
              }
              return value
                .split(",")
                .map(skill => skill.trim())
                .filter(Boolean);
            }
          })}
            defaultValue={freelancerProfile?.skills?.join(", ")} // Convert array to string
            error={freelancerErrors?.skills?.message}
        />
          <p className="text-muted-foreground text-sm">
            Add up to 10 skills separated by commas
          </p>
        </div>

          <div className="space-y-4 mb-4">
            <h2>Portfolio Links</h2>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-end">
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <Input
                    defaultValue={field.platform}
                    placeholder="Platform (e.g. GitHub)"
                    // error={errors.profileType..[index]?.platform?.message}
                    {...register(`portfolioLinks.${index}.platform`)}
                    // error={errors.portfolioLinks?.[index]?.platform?.message}
                  />
                  <Input
                  defaultValue={field.url}
                  placeholder="https://github.com/johndoe"
                  // error={errors.portfolioLinks?.[index]?.url?.message}
                    {...register(`portfolioLinks.${index}.url`)}
                    // error={errors.portfolioLinks?.[index]?.url?.message}
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ platform: "", url: "" })}
            >
              Add Portfolio Link
            </Button>
          </div>
        </div>
      ) : null}

      {profileType && (
        <div className="mt-4">          
          <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <LoaderCircle className="mr-2 animate-spin mt-4" />}
          {(employerProfile?.id || freelancerProfile?.id) ? "Update Profile" : "Create Profile"}
          </Button>
          
        </div>
        
      )}
    </form>
  );
  
}

