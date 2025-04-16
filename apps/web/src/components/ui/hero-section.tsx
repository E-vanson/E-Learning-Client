"use client";

import { motion,useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import BannerImage from './banner-image';
import { Button } from '@elearning/ui';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import AfricaMapIcon from "@elearning/assets/images/map.png";


const HeroSection = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const leftIconsX = useTransform(x, [0, 100], [0, 20]);
  const rightIconsX = useTransform(x, [0, 100], [0, -20]);
    const [image, setImage] = useState(AfricaMapIcon);

    const controls = useAnimation();

  useEffect(() => {
    controls.start('visible');
  }, [controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const textVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'easeOut', duration: 0.8 },
    },
  };

  const imageVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: 'easeOut', duration: 0.8, delay: 0.4 },
    },
  };

  return (
    <motion.div
     className="bg-teal-50p dark:bg-muted/70 min-h-[85vh] md:min-h-[90vh] flex items-center"
      initial="hidden"
      animate={controls}
      variants={containerVariants}

      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - rect.left);
        y.set(event.clientY - rect.top);
      }}
    >
      {/* Background Icons */}      

      {/* Content */}
      <div className="container py-12 lg:py-20 relative z-10">
       <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12">
          {/* Text Content Section */}
          <div className="flex flex-col justify-center space-y-6 order-0 md:order-none text-center md:text-left">
            <motion.div className="space-y-4" variants={textVariants}>
              <motion.h1 
                className="text-custom-orange dark:text-foreground text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                variants={textVariants}
              >
                Empowering Africa
              </motion.h1>
              <motion.h1 
                className="text-teal dark:text-foreground text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                variants={textVariants}
              >
                Through AI
              </motion.h1>
            </motion.div>
            
            <motion.div
              className="text-black dark:text-foreground font-space-grotesk text-lg lg:text-xl max-w-2xl mb-6 md:mb-0 mx-auto md:mx-0"
              variants={textVariants}
            >
              Empowering Africa Through Artificial Intelligence – Unlocking potential, driving innovation, and shaping the future of technology in Africa.
            </motion.div>
            
            <motion.div
              className="mt-6 flex justify-center md:justify-start"
              variants={textVariants}
            >
              <Button
                variant="custom"
                className="w-auto rounded-full px-6 py-5 text-lg md:text-xl shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                asChild
              >
                <Link href="/browse" className="flex items-center gap-2">
                  Get Started Today
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Image Section */}
          <motion.div
            className="relative w-full md:max-w-[800px] lg:ms-auto order-1 md:order-none mt-8 md:mt-0"
            variants={imageVariants}
          >
            <div className="relative w-full h-0 pb-[56.25%] md:pb-[75%] lg:pb-[56.25%]"> 
              <div className="absolute inset-0">
                <BannerImage className="w-full h-full object-cover object-center rounded-lg shadow-2xl transform md:scale-110 lg:scale-100 hover:scale-105 transition-transform" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
export default HeroSection;