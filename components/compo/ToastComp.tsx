import { easeIn, motion } from "motion/react";
import React from "react";

export default function ToastComp() {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 40, opacity: 0 }}
      transition={{
        duration: 0.1,
        ease: "easeInOut",
        type: "spring",
        stiffness: 700,
        damping: 30,
        bounce: 0.25,
      }}
      className="border dark:border-[#ffffff50] border-[#0F0F0F] dark:bg-[#0F0F0F] bg-white  px-3 py-2 rounded-xl text-white absolute bottom-10 right-12 flex items-center text-sm gap-5"
    >
      <p>Reading habit deleted</p>
      <div className="bg-blue-900 font-medium rounded-sm text-xs py-1 px-2 cursor-pointer">
        Undo
      </div>
    </motion.div>
  );
}
