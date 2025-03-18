import { motion } from "framer-motion";
import { brands } from "@/Landing/constants/constants";
import * as variants from "@/Animation/motionVariants";
const Brand = () => {
  return (
    <section className="section">
      <div className="container max-w-screen-lg">
        <motion.p
          variants={variants.fadeInUp}
          initial="start"
          whileInView="end"
          viewport={{ once: true }}
          className="text-center mb-4 md:mb-6"
        >
          Powering data insights for today's startup and tomorrow's leader.
        </motion.p>
        <motion.div
          variants={variants.fadeInUp}
          initial="start"
          whileInView="end"
          viewport={{ once: true }}
          className="flex justify-center flex-wrap gap-5 md:gap-10"
        >
          {brands.map((BrandIcon, index) => (
            <motion.figure
              variants={variants.fadeInUp}
              key={index}
              className="opacity-[0.6]"
            >
              {BrandIcon}
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Brand;
