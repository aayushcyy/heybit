import React from "react";
import { motion } from "motion/react";

export default function Loader() {
  return (
    <div className="w-full h-screen bg-[#0F0F0F] flex items-center justify-center">
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0, y: -40 }}
        className="loader"
      ></motion.div>
    </div>
  );
}
