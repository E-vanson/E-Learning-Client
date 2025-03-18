"use client"

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const stats = [
  { id: 1, value: 500, suffix: "+", label: "Instructors" },
  { id: 2, value: 90, suffix: "K+", label: "Students" },
  { id: 3, value: 70, suffix: "K+", label: "Employed" },
  { id: 4, value: 100, suffix: "K+", label: "Revenue Generated" },
  { id: 5, value: 500, suffix: "+", label: "Courses" },
];

export function ImpactStatistics() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [countedValues, setCountedValues] = useState(stats.map(() => 0));

  useEffect(() => {
    if (isInView) {
      stats.forEach((stat, index) => {
        const target = stat.value;
        const duration = 2000;
        const step = target / (duration / 10);
        
        let current = 0;
        const counter = setInterval(() => {
          current += step;
          if (current >= target) {
            clearInterval(counter);
            current = target;
          }
          setCountedValues(prev => {
            const newValues = [...prev];
            newValues[index] = Math.round(current);
            return newValues;
          });
        }, 10);
      });
    }
  }, [isInView]);

  return (
    <div className="container py-12 lg:py-20" ref={ref}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Statistics */}
        <div className="space-y-8 z-10">         
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                className="bg-background/80 p-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-teal-50p transition-shadow"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-3xl font-bold text-foreground">
                    {countedValues[index]}
                  </span>
                  <span className="text-lg md:text-xl text-teal">
                    {stat.suffix}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1 text-sm md:text-base">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side - Africa Map */}
        <motion.div 
          className="relative h-64 md:h-96 w-full"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src={require("@elearning/assets/images/africa.png")}
            alt="Africa Map"
            fill
            className="object-contain object-center shadow-2xl transform md:scale-110 lg:scale-100 hover:scale-105 transition-transform"
            quality={100}
            priority
          />
        </motion.div>
      </div>
    </div>
  );
}