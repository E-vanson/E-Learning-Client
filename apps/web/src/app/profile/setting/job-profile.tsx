"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@elearning/ui";
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
import { deleteEmployerProfile } from "@/lib/actions/user/delete-employer-profile";
import { deleteFreelancerProfile } from "@/lib/actions/user/delete-freelancer-profile";

const employerSchema = z.object({
  companyName: z.string().min(1, {
    message: "Please enter company name",
  }),
  companyDescription: z.string({
    message: "Please enter company description",
  }).optional(),
  website: z.string().url({
    message: "Please enter valid website URL",
  }).optional()
});

const freelancerSchema = z.object({
  headline: z.string({
    message: "Please enter a headline",
  }).optional(),
  overview: z.string()
    .min(50, {
      message: "Overview must be at least 50 characters",
    })
    .max(2000, "Overview should be less than 2000 characters"),
  hourlyRate: z.number({
    message: "Please enter an hourly rate",
  }),
  skills: z.array(z.string().min(1, {
      message: "Please enter at least one skill",
    }))
    .max(10, "Maximum 10 skills allowed")
    .transform(values => values.filter(Boolean))
    .optional()
    .default([]),
  portfolioLinks: z.array(
    z.object({
      platform: z.string().min(1, {
        message: "Platform is required",
      }),
      url: z.string().url({
        message: "Please enter a valid URL",
      })
    })
  ).optional()
});

// Use simple union instead of discriminated union
const formSchema = z.union([
  employerSchema,
  freelancerSchema
]);

type FormData = z.infer<typeof formSchema>;

type ProfileType = "employer" | "freelancer" | "user" | "hybrid";

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activeUpdate, setActiveUpdate] = useState<'employer' | 'freelancer' | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<"employer" | "freelancer" | null>(null);
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

  // const profileSchema = z.discriminatedUnion("profileType", [employerSchema, freelancerSchema]);

  // const isEmployerr = user.jobRole === "employer";
  // const isFreelancerr = user.jobRole === "freelancer";    

  // // const isFreelancer = watch('profileType') === 'freelancer';
  const isHybridProfile = !!employerProfile?.id && !!freelancerProfile?.id;

  // const freelancerErrors = isFreelancer
  //   ? (errors as FieldErrors<FreelancerFormType>)
  //   : undefined;

  // const employerErrors = !isFreelancer
  //   ? (errors as FieldErrors<EmployerFormType>)
  //   : undefined;

   const {
    register: registerEmployer,
    handleSubmit: handleEmployerSubmit,
    formState: { errors: employerErrors, isSubmitting: isEmployerSubmitting },
    reset: resetEmployer
  } = useForm<EmployerFormType>({
    resolver: zodResolver(employerSchema),
    defaultValues: {      
      companyName: employerProfile?.companyName ?? "",
      companyDescription: employerProfile?.companyDescription ?? "",
      website: employerProfile?.website ?? ""
    }
  });

  const {
    register: registerFreelancer,
    handleSubmit: handleFreelancerSubmit,
    formState: { errors: freelancerErrors, isSubmitting: isFreelancerSubmitting },
    control,
    reset: resetFreelancer
  } = useForm<FreelancerFormType>({
    resolver: zodResolver(freelancerSchema),
    defaultValues: {      
      overview: freelancerProfile?.overview ?? "",
      hourlyRate: freelancerProfile?.hourlyRate ?? 0,
      skills: freelancerProfile?.skills ?? [],
      headline: freelancerProfile?.headline ?? "",
      portfolioLinks: freelancerProfile?.portfolioLinks ?? []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "portfolioLinks"        
  });  

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const employer = await getEmployerData(user.id);
        const freelancer = await getFreelancerProfile(user.id);
        if (employer && freelancer) {
          setProfileType("hybrid");
        } else if (employer) {
          setProfileType("employer");
        } else if (freelancer) {
          setProfileType("freelancer");
        }

        setEmployerProfile(employer);
        setFreelancerProfile(freelancer);
        
        // Reset forms with existing data
        if (employer) resetEmployer(employer);
        if (freelancer) resetFreelancer(freelancer);
      } catch (error) {
        toast({ variant: "destructive", title: "Failed to load profiles" });
      }finally{
        setLoading(false);
      }
    };

    if (user.jobRole !== "user") {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [user]);    

  const handleRoleSelection = async (selectedType: "employer" | "freelancer") => {
    try {     
      setProfileType(selectedType);
      if (selectedType === "freelancer" ) {
        setFreelancerProfile({ ...freelancer, userId: user.id });
      } else if(selectedType === "employer" ) {
        setEmployerProfile({ ...employer, userId: user.id });
      }
      toast({ variant: "success", title: "Profile type created!" });
    } catch (error) {
      toast({ variant: "destructive", title: parseErrorResponse(error) });
    }finally {
      setActiveUpdate(null);
    }
  };  

//   console.log("The current active update", activeUpdate)
//   const handleProfileUpdate = async (data: FormData) => {    
//     try {      
//     console.log("Im here")
//       if (activeUpdate === 'employer' || profileType === 'employer') {
//         console.log("Im here 2", data)
//         if (data.profileType === 'employer') {
//         console.log("Im here 3")
//           const employerData = {
//           companyName: data?.companyName,
//           companyDescription: data.companyDescription,
//           website: data.website,
//         };
//         if (employerProfile?.id) {          
//           const updated = await updateUserEmployerProfile({
//             id: employerProfile.id,
//             userId: user.id,
//             ...employerData
//           });
//           if(updated) setEmployerProfile(updated);
//           toast({ variant: "destructive", title: "Error Updating Profile" });
//         }
//         else {     
//           console.log("The current active employer data", data)
//           const result = await createUserJobProfile("employer", data);
//           if (result) setEmployerProfile(result);
//           toast({ variant: "destructive", title: "Error Creating Profile" });          
//         }
//         }
        
//       } else if (activeUpdate === 'freelancer' || profileType === 'freelancer') {
//         if (data.profileType === 'freelancer') {
//             const freelancerData = {
//               overview: data.overview,
//               hourlyRate: data.hourlyRate,
//               skills: data.skills,
//               headline: data.headline,
//               portfolioLinks: data.portfolioLinks,
//             };

//           if (freelancerProfile?.id) {
//             const updated = await updateUserFreelancerProfile({
//               id: freelancerProfile.id,
//               userId: user.id,
//               ...freelancerData,
//             });
//             if (updated) setFreelancerProfile(updated);
//             toast({ variant: "success", title: "Freelancer Profile Updated!" });
//           } else {
//             const result = await createUserJobProfile("freelancer", {
//               ...freelancerData,
//               userId: user.id,
//             });
//             if (result) setFreelancerProfile(result);
//             toast({ variant: "success", title: "Freelancer Profile Created!" });
//           }
//         }
//         }                       
//     } catch (error) {
//       toast({ variant: "destructive", title: parseErrorResponse(error) });
//     }
//   };

//   const handleDeleteProfile = async (target: 'employer' | 'freelancer' | 'user' | 'hybrid') => {
//   try {
//     if (isHybridProfile) {
//       // Handle hybrid profile deletion
//       if (target === "employer" && employerProfile?.id) {
//         // Delete employer profile and switch to freelancer
//         const result = await deleteEmployerProfile(employerProfile.id);
//         if (result) {
//           setEmployerProfile(null);
//           setProfileType("freelancer");
//           toast({ variant: "success", title: "Employer profile deleted!" });
//         } else {
//           toast({ variant: "destructive", title: "Employer profile failed to delete!" });
//         }
//       } else if (target === "freelancer" && freelancerProfile?.id) {
//         // Delete freelancer profile and switch to employer
//         const result = await deleteFreelancerProfile(freelancerProfile.id);
//         if (result) {
//           setFreelancerProfile(null);
//           setProfileType("employer");
//           toast({ variant: "success", title: "Freelancer profile deleted!" });
//         } else {
//           toast({ variant: "destructive", title: "Freelancer profile failed to delete!" });
//         }
//       }
//     } else if (profileType === "employer") {
//       // Delete employer profile and switch to user
//       if (employerProfile?.id) {
//         const result = await deleteEmployerProfile(employerProfile.id);
//         if (result) {
//           setEmployerProfile(null);
//           setProfileType("user");
//           toast({ variant: "success", title: "Employer profile deleted!" });
//         } else {
//           toast({ variant: "destructive", title: "Employer profile failed to delete!" });
//         }
//       }
//     } else if (profileType === "freelancer") {
//       // Delete freelancer profile and switch to user
//       if (freelancerProfile?.id) {
//         const result = await deleteFreelancerProfile(freelancerProfile.id);
//         if (result) {
//           setFreelancerProfile(null);
//           setProfileType("user");
//           toast({ variant: "success", title: "Freelancer profile deleted!" });
//         } else {
//           toast({ variant: "destructive", title: "Freelancer profile failed to delete!" });
//         }
//       }
//     }
//   } catch (error) {
//     toast({ variant: "destructive", title: parseErrorResponse(error) });
//   } finally {
//     setShowDeleteDialog(false);
//   }
// };


  function isEmployer(profile: EmployerProfile | Freelancer): profile is EmployerProfile {
    return 'companyName' in profile;    
  }  

  const handleEmployerFormSubmit = async (data: EmployerFormType) => {
    try {
      if (employerProfile?.id) {
        const updated = await updateUserEmployerProfile({
          id: employerProfile.id,
          userId: user.id,
          ...data
        });
        setEmployerProfile(updated);
        toast({ variant: "success", title: "Employer profile updated!" });
      } else {
        const created = await createUserJobProfile("employer", data);
        setEmployerProfile(created);
        if (freelancerProfile) setProfileType("hybrid");
        toast({ variant: "success", title: "Employer profile created!" });
      }
    } catch (error) {
      toast({ variant: "destructive", title: parseErrorResponse(error) });
    }
  };

  // Freelancer form handler
  const handleFreelancerFormSubmit = async (data: FreelancerFormType) => {
    console.log("Function Called")
    try {
      if (freelancerProfile?.id) {
        const updated = await updateUserFreelancerProfile({
          id: freelancerProfile.id,
          userId: user.id,
          ...data
        });
        setFreelancerProfile(updated);
        toast({ variant: "success", title: "Freelancer profile updated!" });
      } else {
        console.log("I'm here creating a freelancer profile", data)
        const created = await createUserJobProfile("freelancer", data);
        setFreelancerProfile(created);
        if (employerProfile) setProfileType("hybrid");
        toast({ variant: "success", title: "Freelancer profile created!" });
      }
    } catch (error) {
      toast({ variant: "destructive", title: parseErrorResponse(error) });
    }
  };

  // Delete handler
  const handleDelete = async (target: "employer" | "freelancer") => {
    try {
      if (target === "employer" && employerProfile?.id) {
        await deleteEmployerProfile(employerProfile.id);
        setEmployerProfile(null);
        setProfileType(freelancerProfile ? "freelancer" : "user");
      }
      
      if (target === "freelancer" && freelancerProfile?.id) {
        await deleteFreelancerProfile(freelancerProfile.id);
        setFreelancerProfile(null);
        setProfileType(employerProfile ? "employer" : "user");
      }
      
      toast({ variant: "success", title: `${target} profile deleted!` });
    } catch (error) {
      toast({ variant: "destructive", title: parseErrorResponse(error) });
    } finally {
      setShowDeleteDialog(false);
    }
  };
    
  if (loading) return <LoaderCircle className="animate-spin" />;
  console.log("The current profile type: ", profileType)
  return (
    <div className="space-y-8">     
      {(profileType === "employer" || profileType === "hybrid") && (
        <form
          className="space-y-4 p-6 border rounded-lg" 
          onSubmit={handleEmployerSubmit(handleEmployerFormSubmit, (errors) => {  
          console.log("The form errors: ", errors)    
          toast({
          variant: "destructive",
          title: "Validation errors",
          description: "Please check the form fields"
          });
        })}>
          <h2 className="text-2xl font-bold">
            {employerProfile ? "Employer Profile" : "Create Employer Profile"}
          </h2>

          <Input
            label="Company Name"
            {...registerEmployer("companyName")}
            error={employerErrors.companyName?.message}
          />
          
          <Input
            label="Company Description"
            type="textarea"
            {...registerEmployer("companyDescription")}
            error={employerErrors.companyDescription?.message}
          />
          
          <Input
            label="Website"
            {...registerEmployer("website")}
            error={employerErrors.website?.message}
          />

          <div className="flex gap-4 mt-6 justify-end">
            <Button type="submit"
              variant="secondary"
              disabled={isEmployerSubmitting}>
              {isEmployerSubmitting && <LoaderCircle className="mr-2 animate-spin" />}
              {employerProfile ? "Update Profile" : "Create Profile"}
            </Button>
            
            {employerProfile && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  setDeleteTarget("employer");
                  setShowDeleteDialog(true);
                }}
              >
                Delete Employer Profile
              </Button>
            )}
          </div>
        </form>
      )}

      {(profileType === "freelancer" || profileType === "hybrid") && (
        <form className="space-y-4 p-6 border rounded-lg"
          onSubmit={handleFreelancerSubmit(handleFreelancerFormSubmit, (errors) => {  
          console.log("The form errors: ", errors)    
          toast({
          variant: "destructive",
          title: "Validation errors",
          description: "Please check the form fields"
          });
        })}>
          <h2 className="text-2xl font-bold">
            {freelancerProfile ? "Freelancer Profile" : "Create Freelancer Profile"}
          </h2>

          <Input
            label="Headline"
            {...registerFreelancer("headline")}
            error={freelancerErrors.headline?.message}
          />
          
          <Input
            label="Overview"
            type="textarea"
            {...registerFreelancer("overview")}
            error={freelancerErrors.overview?.message}
          />
          
          <Input
            label="Hourly Rate"
            type="number"
            {...registerFreelancer("hourlyRate", { valueAsNumber: true })}
            error={freelancerErrors.hourlyRate?.message}
          />

          <div className="space-y-2">
            <Input
              type="text"
              label="Skills"
              {...registerFreelancer("skills", {
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

          <div className="space-y-4">
            <h3 className="font-medium">Portfolio Links</h3>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-end">
                <Input
                  placeholder="Platform"
                  {...registerFreelancer(`portfolioLinks.${index}.platform`)}
                />
                <Input
                  placeholder="URL"
                  {...registerFreelancer(`portfolioLinks.${index}.url`)}
                />
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

          <div className="flex gap-4 mt-6 justify-end">
            <Button
              type="submit"
              disabled={isFreelancerSubmitting}
              variant="secondary"
            >
              {isFreelancerSubmitting && <LoaderCircle className="mr-2 animate-spin" />}
              {freelancerProfile ? "Update Profile" : "Create Profile"}
            </Button>
            
            {freelancerProfile && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  setDeleteTarget("freelancer");
                  setShowDeleteDialog(true);
                }}
              >
                Delete Freelancer Profile
              </Button>
            )}
          </div>
        </form>
      )}

      {/* Profile Type Management */}
      {user.jobRole === "user" && profileType === "user" && (
        <div className="space-y-4 p-6 border rounded-lg">
          <h2 className="text-2xl font-bold">Get Started</h2>
          <Select
            onValueChange={(value) => {
              const type = value as "employer" | "freelancer";
              setProfileType(type);
            }}
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select profile type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="employer">Employer Profile</SelectItem>
              <SelectItem value="freelancer">Freelancer Profile</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Show add profile button only when not in hybrid mode */}
      {(employerProfile?.id || freelancerProfile?.id) && !isHybridProfile && (
        <div className="mt-4 flex gap-2">
          <Button 
            type="button" 
            onClick={() => setProfileType('hybrid')}
            disabled={isHybridProfile}
          >
            {employerProfile?.id && !freelancerProfile?.id
              ? "Add Freelancer Profile"
              : freelancerProfile?.id && !employerProfile?.id
              ? "Add Employer Profile"
              : "Both Profiles Exist"}
          </Button>
        </div>
      )}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your {deleteTarget} profile?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>               
    </div>
    
  );
  
}
