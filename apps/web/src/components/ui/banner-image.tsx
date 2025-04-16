"use client";

import TeachingImage from "@elearning/assets/images/istockphoto-1010593984-1024x1024.jpg";
import TeachingImageDark from "@elearning/assets/images/istockphoto-1010593984-1024x1024.jpg";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function BannerImage({ className }: { className?: string }) {
  const { theme } = useTheme();

  const [image, setImage] = useState(TeachingImage);

  useEffect(() => {
    setImage(theme === "dark" ? TeachingImageDark : TeachingImage);
  }, [theme]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Image
        src={'http://localhost:3080/uploads/2025/03/istockphoto-1010593984-1024x1024.jpg'}
        alt="Hero Banner"
        fill
        sizes="1000vh"
        className={className}
        priority
      />
    </motion.div>
  );
}

export default BannerImage;
