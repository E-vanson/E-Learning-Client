"use client";

import { useState} from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react'; // Assuming you're using Lucide React icons
import { Button } from '@elearning/ui';
import Link from 'next/link'; // Assuming you're using Next.js for routing
import Image from "next/image";
import CommunityPhoto from "@elearning/assets/images/Screenshot from 2025-03-11 10-22-29.png";

const AboutUs = () => {
    const [image, setImage] = useState(CommunityPhoto);
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: -20 }, // Adjusted for left-side animation
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="container py-12 lg:py-20 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12">
        {/* Image Section (Now on the Left) */}
        <motion.div
          className="relative w-full md:max-w-[800px] lg:me-auto order-1 md:order-none mt-8 md:mt-0"
          variants={imageVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="relative w-full h-0 pb-[56.25%] md:pb-[75%] lg:pb-[56.25%]">
            <div className="absolute inset-0">
              <Image
                src={ image }
                alt="AI Innovators"
                className="w-full h-full object-cover object-center rounded-lg shadow-2xl transform md:scale-110 lg:scale-100 hover:scale-105 transition-transform"
              />
            </div>
          </div>
        </motion.div>

        {/* Text Content Section (Now on the Right) */}
              <div className="flex flex-col justify-center space-y-6 order-0 md:order-none text-center md:text-left">
                   <motion.h2
            className="text-teal dark:text-gray-400 text-lg md:text-xl lg:text-2xl font-semibold uppercase tracking-wider"
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            ABOUT US
          </motion.h2>
          <motion.div className="space-y-4" variants={textVariants} initial="hidden" animate="visible">
            <motion.h1 
              className="text-custom-orange dark:text-foreground text-2xl md:text-3xl lg:text-4xl font-bold leading-tight"
              variants={textVariants}
            >
              Creating a Community of
            </motion.h1>
            <motion.h1 
              className="text-teal dark:text-foreground text-2xl md:text-3xl lg:text-4xl font-bold leading-tight"
              variants={textVariants}
            >
              AI Innovators
            </motion.h1>
          </motion.div>
          
          <motion.div
            className="text-black font-space-grotesk text-lg lg:text-xl max-w-2xl mb-6 md:mb-0 mx-auto md:mx-0"
            variants={textVariants}
          >
            Our platform serves as a comprehensive ecosystem where technology meets opportunity, connecting learners with cutting-edge AI courses, industry insights through our blog, and career advancement opportunities through our integrated job board.
          </motion.div>
          
          <motion.div
            className="mt-6 flex justify-center md:justify-start"
            variants={textVariants}
          >
            <Button
              variant = "custom"
              className="w-auto rounded-full px-6 py-5 text-lg md:text-xl shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
              asChild
            >
              <Link href="/browse" className="flex items-center gap-2">
                Learn More
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;