"use client"

import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from 'next/image';

type Testimonial = {
  id: number;
  text: string;
  name: string;
  profile: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    text: "Our platform serves as a comprehensive ecosystem where technology meets opportunity, connecting learners with cutting-edge AI courses, industry insights through our blog, and career advancement opportunities.",
    name: "John Doe",
    profile: "AI Engineering Student",
  },
  {
    id: 2,
    text: "The courses transformed my career. I landed my dream job in machine learning within 3 months of completing the program!",
    name: "Jane Smith",
    profile: "Machine Learning Engineer",
  },
  {
    id: 3,
    text: "The instructors are amazing, and the content is top-notch. I highly recommend this platform to anyone looking to upskill in AI.",
    name: "Alice Johnson",
    profile: "Data Scientist",
  },
];

export function TestimonialsSection() {
  return (
    <div className="container py-12 lg:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Left Side - Carousel */}
        <div className="space-y-8">
          {/* <div className="space-y-4 text-center md:text-left">
            <h3 className="text-lg font-semibold text-white text-center uppercase tracking-wide">
              TESTIMONIALS
            </h3>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              What Our Learners Say
            </h2>
          </div> */}

          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            pagination={{
              clickable: true,
              el: '.testimonial-pagination',
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            modules={[Autoplay, Pagination]}
            className="w-full h-96"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="bg-muted/50 p-6 rounded-lg h-full flex flex-col justify-between">
                  <p className="text-lg italic">"{testimonial.text}"</p>
                  <div className="mt-6">
                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-muted-foreground">{testimonial.profile}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Pagination Container */}
          <div className="testimonial-pagination flex justify-center md:justify-start space-x-2 !bottom-0" />
        </div>

        {/* Right Side - Image */}
        <div className="relative w-full h-96 md:h-auto">
          <div className="aspect-w-16 aspect-h-9">
            <Image
              src={require("@elearning/assets/images/testimonial.png")}
              alt="Happy Students"
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
}