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

type Instructor = {
  imgPath: any;
  name: string;  
  description: string;  
};

// const [studyImage, setStudyImage] = useState(StudyImage);
// const [jobImage, setJobImage] = useState(JobImage);
// const [certificationImage, setCertificationImage] = useState(CertificationImage);

const INSTRUCTOR_IMAGES = {
  'free-courses': require('@elearning/assets/images/man.png'),
  'certification': require('@elearning/assets/images/testimonial.png'),
  'job-board': require('@elearning/assets/images/man.png')
};


const instructors: Instructor[] = [
  {
    imgPath: 'free-courses',
    name: "John Doe",
    description: "AI Engineer"
    
  },
  {
    imgPath: 'certification',
    name: "John Doe",
    description: "AI Engineer"
    
  },
  {
    imgPath: 'job-board',
    name: "John Doe",
    description: "AI Engineer"
    
  }
];

export function InstructorsGrid() {
  return (
    <div className="container py-3 lg:py-5">   
    {/* <div className="space-y-4 mb-6 text-center md:text-left">
            <h3 className="text-lg font-semibold text-teal uppercase tracking-wide">
              INSTRUCTORS
            </h3>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Course Instructors
            </h2>
          </div>          */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        
        {instructors.map((instructor, index) => (
          <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow hover:bg-teal-50p">
            <CardContent className="p-0 relative">
                    <div className="aspect-w-16 aspect-h-9 relative">
                        <Image
                            src={INSTRUCTOR_IMAGES[instructor.imgPath as keyof typeof INSTRUCTOR_IMAGES]}
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
                            <h3 className="text-xl font-bold">{instructor.name}</h3>
                                                                                                  
                        </div>                        
                        <p className="text-muted-foreground">{instructor.description}</p>                        
                
                {/* <Link 
                  href="#" 
                  className="inline-flex items-center mt-4 text-primary hover:underline"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link> */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}