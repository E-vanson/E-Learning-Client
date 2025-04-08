"use client";

import { firebaseAuth } from "@/lib/firebase.config";
import { updateUserEmployerProfile } from "@/lib/actions/user/update-employer-profile";
import { updateUserFreelancerProfile } from "@/lib/actions/user/update-freelancer-profile";
import { createUserJobProfile } from "@/lib/actions/user/create-job-profile";
import { parseErrorResponse } from "@/lib/parse-error-response";
import { Input } from "@elearning/ui/forms";
import { Button, ProfileAvatar, Separator, useToast } from "@elearning/ui";
import { User, EmployerProfile, Freelancer, PortfolioLinks, UserJobRole } from "@elearning/lib/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { ChangeEvent, useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getFreelancerProfile } from "@/lib/actions/job-application/get-freelancer";
import { getEmployerData } from "@/lib/actions/job-application/get-employer";

const employerSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyDescription: z.string().optional(),
  website: z.string().url("Invalid website URL").optional(),
});

const freelancerSchema = z.object({
  headline: z.string().optional(),
  overview: z.string().min(50, "Overview should be at least 50 characters"),
  hourlyRate: z.number().min(10, "Minimum hourly rate is $10"),
  skills: z.array(z.string()).max(10, "Maximum 10 skills allowed"),
  portfolioLinks: z.array(
    z.object({
      platform: z.string().min(1, "Platform is required"),
      url: z.string().url("Invalid URL"),
    })
  ).optional(),
});

type FormData = z.infer<typeof employerSchema> | z.infer<typeof freelancerSchema>;

type ProfileType = "employer" | "freelancer" | null;

export default function JobProfile({ user }: { user: User }) {
  const { toast } = useToast();
  const [profileType, setProfileType] = useState<ProfileType>(null);
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
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
    control,
  } = useForm({
    resolver: zodResolver(profileType === "employer" ? employerSchema : freelancerSchema),
  });
  const auth = firebaseAuth;
  console.log("Inside job profile....", user)
  console.log("Inside job profile auth....", auth)

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

  const populateForm = (profile: EmployerProfile | Freelancer) => {
    if (isEmployer(profile)) {
      setValue('companyName', profile.companyName || '');
      setValue('companyDescription', profile.companyDescription || '');
      setValue('website', profile.website || '');
    } else {
      setValue('headline', profile.headline || '');
      setValue('overview', profile.overview || '');
      setValue('hourlyRate', profile.hourlyRate || 0);
      setValue('skills', (profile.skills || []).join(', '));
    }
  };

  const createUserRole = (role: UserJobRole) => {
    if (role === 'freelancer') {
      setProfile(freelancer);
    }else{
      setProfile(employer);
    }

  }

  const handleRoleSelection = async (selectedType: "employer" | "freelancer") => {
    try {
      await createUserRole(selectedType);
      setProfileType(selectedType);
      toast({ variant: "success", title: "Profile type created!" });
    } catch (error) {
      toast({ variant: "destructive", title: parseErrorResponse(error) });
    }
  };

  const handleProfileUpdate = async (data: any) => {
    try {
      if (profileType === "employer") {
        await updateUserEmployerProfile({
          ...data,
          userId: user.id,
          id: employerProfile?.id,
        });
      } else {
        await updateUserFreelancerProfile({
          ...data,
          userId: user.id,
          id: freelancerProfile?.id,
        });
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

  if (user.jobRole === "user" && !profileType) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Create Professional Profile</h2>
        <Button onClick={() => handleRoleSelection("freelancer")}>
          Create Freelancer Profile
        </Button>
        <Button onClick={() => handleRoleSelection("employer")}>
          Create Employer Profile
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleProfileUpdate)}>
      {profileType === "employer" ? (
        <div className="space-y-4">
          <Input
            label="Company Name"
            {...register("companyName")}
            value={employerProfile?.companyName}
            // error={errors.companyName?.message}
          />
          <Input
            label="Company Description"
            type="textarea"            
            {...register("companyDescription")}
            defaultValue={employerProfile?.companyDescription}
            // error={errors.companyDescription?.message}
          />
          <Input
            label="Website"
            {...register("website")}
            defaultValue={employerProfile?.website}
            // error={errors.website?.message}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <Input
            label="Headline"
            {...register("headline")}
            defaultValue={freelancerProfile?.headline}
            // error={errors.headline?.message}
          />
          <Input
            label="Overview"
            type="textarea"            
            {...register("overview")}
            defaultValue={freelancerProfile?.overview}
            // error={errors.overview?.message}
          />
          <Input
            label="Hourly Rate ($)"
            type="number"
            {...register("hourlyRate", { valueAsNumber: true })}
            defaultValue={freelancerProfile?.hourlyRate}
            // error={errors.hourlyRate?.message}
          />
          {/* Add complex fields for skills and portfolio links here */}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <LoaderCircle className="mr-2 animate-spin" />}
        Update Profile
      </Button>
    </form>
  );
}

