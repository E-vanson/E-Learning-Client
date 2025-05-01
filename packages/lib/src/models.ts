export type UserRole = "user" | "contributor" | "author" | "admin" | "owner";
export type UserJobRole = "freelancer" | "employer" | "user" | "hybrid";
export type PostStatus = "draft" | "published";
export type JobStatus = "draft" | "closed" | "active";
export type PostVisibility = "public" | "member" | "paid_member";
export type CourseStatus = "draft" | "published";
export type CourseLevel = "beginner" | "intermediate" | "advanced";
export type CourseAccess = "free" | "premium";
export type LessonType = "text" | "video" | "quiz";
export type QuizType = "multiple_choice" | "single_choice" | "short_answer";
export type BudgetType = "fixed" | "hourly";
export type ExperienceLevel = "beginner" | "intermediate" | "experienced"
export type EstimatedTime = "1 Month" | "1 - 2 Months" | "3 Months" | "More Than 3 Months";
export type ProposalStatus = "pending" | "accepted" | "rejected";
export type ContractStatus = "draft" | "active" | "terminated" | "completed";


export interface Page<T> {
  contents: T[];
  currentPage: number;
  totalPage: number;
  pageSize: number;
  totalElements: number;
}

export interface Audit {
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  nickname: string;
  username: string;
  role: UserRole;
  jobRole: UserJobRole;
  email?: string;
  emailVerified: boolean;
  image?: string;
  headline?: string;
  expiredAt: number;
}

export interface UserMeta {
  enrollmentCount: number;
  bookmarkCount: number;
}

export interface Tag {
  id: number;
  slug: string;
  name: string;
  postCount?: string;
  audit?: Audit;
}

export interface Category {
  id: number;
  slug: string;
  cover: string;
  name: string;
  courseCount?: string;
  audit?: Audit;
}

export interface Employer {
  id: number;
  companyName?: string;
}

export interface Post {
  id: number;
  cover?: string;
  title?: string;
  slug: string;
  excerpt?: string;
  lexical?: string;
  html?: string;
  status: PostStatus;
  visibility: PostVisibility;
  featured: boolean;
  wordCount: number;
  authors?: User[];
  tags?: Tag[];
  publishedAt?: string;
  meta?: PostMeta;
  audit?: Audit;
}

  export interface Job {
    id: number;
    title?: string;
    slug?: string;
    description?: string;
    skillsRequired?: string[];
    budget?: number;
    budgetType?: BudgetType;
    deadline: string;
    experienceLevel?: ExperienceLevel;
    employer: Employer;
    employerId: string;
    status: JobStatus;
    publishedAt?: string;
    audit?: Audit;
  }

  export interface PortfolioLinks {
    platform: string;   
    url: string;   
  }  

  export interface Freelancer {
    id: string;
    userId: string;
    headline?: string;
    overview?: string;
    hourlyRate?: number;
    skills?: string[];
    portfolioLinks?: PortfolioLinks[];      
    audit?: Audit; 
  }

export interface Proposal {
  id: number;
  job: Job;
  freelancer: Freelancer;
  cover_letter: string;
  bid_amount: number;
  estimated_time: EstimatedTime;
  status: ProposalStatus;
  file_attachment?: string;
  audit?: Audit;
}

export interface ProposalReview {
  status: ProposalStatus;
  employerFeedback: string;
  reviewedAt: string;
  reviewedBy: string;
}
  
export interface ContractTerms {
  scopeOfWork: string;
  paymentSchedule: string;
  terminationClause: string;
}

export interface Milestone {
  description: string;
  dueDate: Date;
  amount: number;
  completed: boolean;
}

export enum Currency {
    DOLLAR = '$',
    POUND = '£',
    EURO = '€',
    KSH = 'ksh'
}
export interface Contract {
  id: string;
  employer?: Employer;
  freelancer?: Freelancer;
  job?: Job;
  jobId: string;
  freelancerId: string;
  employerId: string;
  terms: ContractTerms;
  startDate: Date;
  endDate: Date;
  paymentAmount: number;
  paymentCurrency: Currency;
  milestones: Milestone[];
  status: ContractStatus;
  audit?: Audit;
  }



export interface EmployerProfile {
  id: string;
  userId: string;
  companyName?: string;
  companyDescription?: string;
  website?: string;
  audit?: Audit;
  }

export interface PostMeta {
  viewCount: string;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  cover?: string;
  excerpt?: string;
  featured: boolean;
  description?: string;
  level: CourseLevel;
  access: CourseAccess;
  status: CourseStatus;
  publishedAt?: string;
  category?: Category;
  authors?: User[];
  chapters?: Chapter[];
  meta?: CourseMeta;
  audit?: Audit;
}

export interface CourseMeta {
  rating: string;
  ratingCount: string;
  enrolledCount: string;
}

export interface CourseReview {
  rating: number;
  message?: string;
  user: User;
  audit: Audit;
}

export interface Chapter {
  id: number;
  title: string;
  slug: string;
  sortOrder: number;
  course?: Course;
  lessons?: Lesson[];
  audit?: Audit;
}

export interface Lesson {
  id: number;
  title: string;
  slug: string;
  trial: boolean;
  type: LessonType;
  lexical?: string;
  html?: string;
  sortOrder: number;
  wordCount: number;
  chapter?: Chapter;
  quizzes?: Quiz[];
  completed?: boolean;
  audit?: Audit;
}

export interface Quiz {
  id: number;
  question: string;
  type: QuizType;
  feedback?: string;
  sortOrder: number;
  answers: QuizAnswer[];
  audit?: Audit;
}

export interface QuizAnswer {
  id: number;
  answer: string;
  correct: boolean;
  sortOrder: number;
  deleted?: boolean;
  audit?: Audit;
}

export interface QuizResponse {
  quizId: number;
  shortAnswer?: string;
  answer: QuizAnswer;
}

export interface EnrolledCourse {
  course: Course;
  resumeLesson?: Lesson;
  completedLessons: number[];
  progress: number;
}

export interface DashboardSummary {
  courseCount: number;
  postCount: number;
  jobCount: number;
  subscriberCount: number;
  userCount: number;
  enrolledByLevel: { [key: string]: number };
}

export interface EmployerDashboardSummary {
  jobCount: number;
  applicationCount: number;
  reviewcount: number;
  contractCount: number
}

export interface EmployerProposalsSummary {
  proposalCount: number;
  contractCount: number;
  reviewCount: number;
}

export interface FreelancerDashboardSummary {
  proposalCount: number;
  contractCount: number;
  proposalReviewCount: number;
  proposals: Proposal[];
}

export interface MonthlyEnrollmentDto {
  data: { [key: string]: number | undefined };
}

export interface SiteSetting {
  aboutUs?: string;
  privacyPolicy?: string;
  termsAndConditions?: string;
}

export interface AuditAction {
  resourceId: string;
  resourceType: string;
  actorId: string;
  actorType: string;
  actorName: string;
  actorImage?: string | null;
  event: string;
  context?: string;
  createdAt: string;
  count: number;
}

export interface AiPromptRequest {
  prompt: string;
  option: string;
  command: string;
  apiKey?: string;
}
