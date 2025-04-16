import { memo } from "react";
import { motion } from "framer-motion";
import { brands } from "@/Landing/constants/constants";
import * as variants from "@/Animation/motionVariants";

const Brand = () => {
  return (
    <section className="section">
      <div className="landing-container max-w-screen-lg">
        {/* Heading */}
        <motion.p
          variants={variants.fadeInUp}
          initial="start"
          whileInView="end"
          viewport={{ once: true, amount: 0.1 }}
          className="text-center mb-4 md:mb-6"
          aria-label="Brand tagline"
        >
          Powering data insights for today's startup and tomorrow's leader.
        </motion.p>

        {/* Brand icons */}
        <motion.div
          variants={variants.fadeInUp}
          initial="start"
          whileInView="end"
          viewport={{ once: true, amount: 0.1 }}
          className="flex justify-center flex-wrap gap-5 md:gap-10"
          transition={{ staggerChildren: 0.15 }}
        >
          {brands.map((BrandIcon, index) => (
            <motion.figure
              key={index}
              variants={variants.fadeInUp}
              className="opacity-60"
              aria-label={`Brand ${index + 1}`}
            >
              {BrandIcon}
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default memo(Brand);
