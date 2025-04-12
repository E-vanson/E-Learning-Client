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
  profileType: z.enum(["employer", "freelancer", "user"])
});

const employerSchema = baseSchema.extend({
  profileType: z.literal("employer"),
  companyName: z.string().min(1, {
    message: "Please enter companyname",
  }),
  companyDescription: z.string({
    message: "Please enter company description",
  }).optional(),
  website: z.string().url({
    message: "Please enter valid website url",
  }).optional()
});

const freelancerSchema = baseSchema.extend({
  profileType: z.literal("freelancer"),
  headline: z.string({
    message: "Please enter a headline",
  }).optional(),
  overview: z.string()
    .min(50,{
    message: "Please enter an overview",
   })
    .max(2000, "Overview should be less than 2000 characters"),
  hourlyRate: z.number( {
    message: "Please enter an hourly rate",
  }),
  skills: z.array(z.string().min(1,{
    message: "Please enter atleast one skill",
   }))
    .max(10, "Maximum 10 skills allowed")
    .transform(values => values.filter(Boolean))
    .optional()
    .default([]), // Add default empty array
  portfolioLinks: z.array(
    z.object({
      platform: z.string().min(1,{
    message: "Platform is required",
  } ),
      url: z.string().url({
    message: "Please enter a valid url",
  })
    })
  ).optional()
});

type FormData = z.infer<typeof employerSchema | typeof freelancerSchema>;

type ProfileType = "employer" | "freelancer" | "user";

type EmployerFormType = {
  profileType: ProfileType;
  companyName: string;
  companyDescription?: string;
  website?: string;
};

type FreelancerFormType = {
  profileType: ProfileType;
  overview: string;
  hourlyRate: number;
  skills: string[];
  headline?: string;
  portfolioLinks?: PortfolioLinks[];
};

export default function JobProfile({ user }: { user: User }) {
  const { toast } = useToast();
  const [profileType, setProfileType] = useState<ProfileType>("user");
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

  const profileSchema = z.discriminatedUnion("profileType", [employerSchema, freelancerSchema]);


  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    trigger
  } = useForm<FormData>({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
    defaultValues: {
      profileType: user.jobRole === "employer" ? "employer" : user.jobRole === "freelancer" ? "freelancer" : undefined,
      skills: freelancerProfile?.skills || [],
      portfolioLinks: freelancerProfile?.portfolioLinks || [] ,
      overview: freelancerProfile?.overview,
      hourlyRate: freelancerProfile?.hourlyRate,
      companyName: employerProfile?.companyName,
      companyDescription: employerProfile?.companyDescription,
      website: employerProfile?.website
      
    },
    shouldUnregister: true
  });

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
          setProfileType("user")
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
    trigger();
  }
}, [profileType, trigger]);
   
  useEffect(() => {
  const subscription = watch((value, { name, type }) => {        
  });
  return () => subscription.unsubscribe();
}, [watch]);

  
useEffect(() => {
  if (freelancerProfile?.skills) {
    setValue("skills", freelancerProfile.skills);
    setValue("profileType", "freelancer")
    setValue("portfolioLinks", freelancerProfile?.portfolioLinks)
  } else if (employerProfile?.companyDescription) {
    setValue("profileType", "employer")
  }
}, [freelancerProfile,employerProfile, setValue]);  

  const handleRoleSelection = async (selectedType: "employer" | "freelancer") => {
    try {     
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
    try {      
      if (profileType === "employer")  {
        if (employerProfile?.id) {          
          const updated = await updateUserEmployerProfile({
            id: employerProfile.id,
            userId: user.id,
            ...data
          });
          if(updated) setEmployerProfile(updated);
          toast({ variant: "destructive", title: "Error Updating Profile" });
        }
        else {          
          const result = await createUserJobProfile("employer", data);
          if (result) setEmployerProfile(result);
          toast({ variant: "destructive", title: "Error Creating Profile" });
          
        }
      } else if (profileType === "freelancer") {
        if (freelancerProfile?.id) {          
          const updated = await updateUserFreelancerProfile({
            id: freelancerProfile.id,
            userId: user.id,
            ...data
          });
          if(updated) setFreelancerProfile(updated);
          toast({ variant: "destructive", title: "Error Updating Profile" });
        }
        else {          
          const result = await createUserJobProfile("freelancer", data);
          if (result) setFreelancerProfile(result);
          toast({ variant: "destructive", title: "Error Creating Profile" });
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
    


  if (loading) return <LoaderCircle className="animate-spin" />;
console.log("The current profile type: ", profileType)
  return (
    <form onSubmit={handleSubmit(handleProfileUpdate, (errors) => {  
      console.log("The form errors: ", errors)    
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

      {profileType === "employer" && (
        <div className="space-y-4">
          <Input
            label="Company Name"
            {...register("companyName")}
            defaultValue={employerProfile?.companyName}
            error={employerErrors?.companyName?.message}
          />
          <Input
            label="Company Description"
            type="textarea"
            {...register("companyDescription")}
            defaultValue={employerProfile?.companyDescription}
            error={employerErrors?.companyDescription?.message}
          />
          <Input
            label="Website"
            {...register("website")}
            defaultValue={employerProfile?.website}
            error={employerErrors?.website?.message}
          />
        </div>
      )}
       { profileType === "freelancer" && (
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
          type="text"
          label="Skills"
          {...register("skills", {
          setValueAs: (value) => 
            typeof value === 'string' 
              ? value.split(',').map(s => s.trim()).filter(Boolean) 
              : value
          })}
            defaultValue={freelancerProfile?.skills?.join(", ")} 
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
                    {...register(`portfolioLinks.${index}.platform`)}                    
                  />
                  <Input
                  defaultValue={field.url}
                  placeholder="https://github.com/johndoe"                  
                    {...register(`portfolioLinks.${index}.url`)}                    
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
      )}

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

