import { BlogGridItem } from "@/components/blog";
import { CourseGridItem } from "@/components/course";
import { CategoryGridItem } from "@/components/category";
import { API_URL_LOCAL } from "@/lib/constants";
import { Course, Page, Post, Category } from "@elearning/lib/models";
import { buildQueryParams } from "@elearning/lib/utils";
import QuoteSwiper from "@/components/ui/quote-swiper";
import HeroSection from "@/components/ui/hero-section";
import { AnimatePresence } from 'framer-motion';
import AboutUs from "@/components/ui/about-us-section";
import { CoreProgramsGrid } from "@/components/core-programs";
import { TestimonialsSection } from "@/components/testimonials";
import { GetInTouchSection } from "@/components/contact";
import { InstructorsGrid } from "@/components/instructors";
import { GetStartedSection } from "@/components/get-started";
import { ImpactStatistics } from "@/components/impact-statistics";
import { PartnersGrid } from "@/components/partners";
import { VideosGrid } from "@/components/videos/videos-section";





const getTopCourses = async () => {
  const query = buildQueryParams({ limit: 8, orderBy: "enrollment" });

  const url = `${API_URL_LOCAL}/content/courses${query}`;

  const resp = await fetch(url, {
    cache: "no-store",
  });

  return resp
    .json()
    .then((json) => json as Page<Course>)
    .catch((e) => undefined);
};

const getRecentPosts = async () => {
  const query = buildQueryParams({ limit: 4, orderBy: "publishedAt" });

  const url = `${API_URL_LOCAL}/content/posts${query}`;

  const resp = await fetch(url, {
    cache: "no-store",
  });

  return resp
    .json()
    .then((json) => json as Page<Post>)
    .catch((e) => undefined);
};

const getCategories = async () => {
  const query = buildQueryParams({ limit: 8, orderBy: "publishedAt", includeCourseCount: true });

  const url = `${API_URL_LOCAL}/content/categories${query}`;

  const resp = await fetch(url, {
    cache: "no-store",
  });

  return resp
    .json()
    .then((json) => json as Page<Category>)
    .catch((e) => undefined);
};


export default async function Home() {
  const topCoursesPromise = getTopCourses();
  const recentPostsPromise = getRecentPosts();
  const categoriesPromise = getCategories();

  const [topCourses, recentPosts, categories] = await Promise.all([
    topCoursesPromise,
    recentPostsPromise,
    categoriesPromise
  ]);

  const topCoursesUI = (list: Course[]) => {
    if (list.length === 0) {
      return <p className="text-muted-foreground mb-5">No content found</p>;
    }

    return list.map((c) => {
      return <CourseGridItem key={c.id} data={c} />; 
    });
    
  };

  const recentPostsUI = (list: Post[]) => {
    if (list.length === 0) {
      return <p className="text-muted-foreground mb-5">No content found</p>;
    }

    return list.map((p) => {
      return <BlogGridItem key={p.id} data={p} />;
    });
  };

  const categoriesUI = (list: Category[]) => {
    if (list.length === 0) {
      return <p className="text-muted-foreground mb-5">No content found</p>;
    }

    return list.map((c) => {
      return <CategoryGridItem key={c.id} data={c} />
    })
  }

  return (
    <>     
      <AnimatePresence mode="wait">
  <HeroSection />
</AnimatePresence>

      <div className="px-3 border-b">
        <QuoteSwiper />
      </div>      
      <div className="container py-10">        
        <h3 className="mb-5 text-center text-teal">Course Categories</h3>
        <h2 className="mb-10 text-center text-gray-600">Popular Topics To Learn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 bg-transparent">
          {categoriesUI(categories?.contents ?? [])}
        </div>
      </div>
      <div className="container py-10"> 
        <h3 className="mb-5 text-center text-teal">Popular Courses</h3>
        <h2 className="mb-10 text-center text-gray-600">Pick A Course To Get Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 bg-transparent">
          {topCoursesUI(topCourses?.contents ?? [])}
        </div>       
      </div>
        <div className="container py-10">    
        <h3 className="mb-5 text-center text-teal">Our Core Programs</h3>
        <h2 className="mb-10 text-center text-gray-600">What We Offer</h2>
        <div className="px-3 mb-8 border-b">
          <CoreProgramsGrid/>
        </div>        
        </div>
        <div className="container py-10">   
        <h3 className="mb-5 text-center text-teal">Latest Blogs</h3>
        <h2 className="mb-10 text-center text-gray-600">Get Latest News With Empower</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 bg-transparent">
          {recentPostsUI(recentPosts?.contents ?? [])}
        </div>
      </div>
      <GetStartedSection/>
      <div className="50p px-3 mb-8 border-b">
        <AboutUs/>
      </div>
      <GetInTouchSection />  
      <div className="py-1 px-3 border-b mb-8">
        <h3 className="mb-5 text-center text-teal">Our Partners</h3>
        <h2 className="text-center text-gray-600  mb-8">The Team Behind Empower</h2>
          <PartnersGrid/>
      </div>  
      <div className="py-10 bg-teal-50p px-3 border-b">
        <h3 className="mb-5 text-center text-teal">Testimonials</h3>
        <h2 className="text-center text-gray-600">What Our Learners Say</h2>
          <TestimonialsSection/>
      </div>                
      <div className="container py-10 px-3 border-b">
        <h3 className="mb-5 text-center text-teal">Instructors</h3>
        <h2 className="text-center text-gray-600">Course Instructors</h2>
         <InstructorsGrid /> 
      </div>
      <div className="container py-10 px-3 border-b">
        <h3 className="mb-5 text-center text-teal">Impact Statistics</h3>
        <h2 className="text-center text-gray-600">Where We Have Impacted</h2>
         <ImpactStatistics /> 
      </div>
      <div className="container py-10 px-3 border-b">
        <h3 className="mb-5 text-center text-teal">Get To Know Us</h3>
        {/* <h2 className="text-center text-gray-600">Where We Have Impacted</h2> */}
         <VideosGrid />  
      </div>
            
    </>
  );
}

