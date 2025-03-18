import {
    Card,
    CardContent,
    CardFooter,
    Separator,
} from "@elearning/ui";
import { Category } from "@elearning/lib/models";
import {
    formatAbbreviate,
    formatRelativeTimestamp,
    pluralize,
    wordPerMinute,
} from "@elearning/lib/utils";
import Image from "next/image";
import Link from "next/link";
// import { useState } from "react";
import { ArrowRight } from "lucide-react";
import StudyImage from "@elearning/assets/images/study.png";
import CertificationImage from "@elearning/assets/images/certification.png";
import JobImage from "@elearning/assets/images/job.png";

type CoreProgram = {
  imgPath: any;
  iconPath: string;
  programName: string;
  description: string;
};

// const [studyImage, setStudyImage] = useState(StudyImage);
// const [jobImage, setJobImage] = useState(JobImage);
// const [certificationImage, setCertificationImage] = useState(CertificationImage);

const PROGRAM_IMAGES = {
  'free-courses': require('@elearning/assets/images/study.png'),
  'certification': require('@elearning/assets/images/certification.png'),
  'job-board': require('@elearning/assets/images/job.png')
};

const PROGRAM_ICONS = {
  'courses': require('@elearning/assets/images/open-book.png'),
  'certifications': require('@elearning/assets/images/certificate.png'),
  'job': require('@elearning/assets/images/job-seeker.png')
};

const corePrograms: CoreProgram[] = [
  {
    imgPath: 'free-courses',
    iconPath: "courses",
    programName: "Free Courses",
    description: "Get free access to our top-notch courses on Artificial Intelligence and Machine Learning to showcase your professionalism."
  },
  {
    imgPath: 'certification',
    iconPath: "certifications",
    programName: "Certification Programs",
    description: "Earn certifications on top AI courses and enhance your career prospects with recognized credentials."
  },
  {
    imgPath: 'job-board',
    iconPath: "job",
    programName: "Career Connect",
    description: "Get connected to your dream AI job through our integrated job board and industry partnerships."
  }
];

export function CoreProgramsGrid() {
  return (
    <div className="container py-3 lg:py-5">            
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {corePrograms.map((program, index) => (
          <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl hover:bg-teal-50p transition-shadow">
            <CardContent className="p-0 relative">
                    <div className="aspect-w-16 aspect-h-9 relative">
                        <Image
                            src={PROGRAM_IMAGES[program.imgPath as keyof typeof PROGRAM_IMAGES]}
                            className="bg-primary object-cover"
                            alt="Image"
                            priority
                            fill
                            sizes="33vh"
                        />
                        
                {/* <Image
                  src={require(`@elearning/assets/images/${program.imgPath}`)}
                  alt={program.programName}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                /> */}
                
              </div>
              
              <div className="p-6">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-bold">{program.programName}</h3>
                            
                  <div className="bg-background/90 p-2 rounded-full">
                    <Image
                    src={PROGRAM_ICONS[program.iconPath as keyof typeof PROGRAM_ICONS]}
                    alt="icons"
                    width={32}
                    height={32}
                    className="h-8 w-8"
                    />

                            </div>                                                        
                        </div>                        
                        <p className="text-muted-foreground">{program.description}</p>                        
                
                <Link 
                  href="#" 
                  className="inline-flex items-center mt-4 text-primary hover:underline"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}