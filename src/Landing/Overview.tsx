import { motion } from "motion/react";
import * as variants from "@/Animation/motionVariants";
import { overviewData } from "@/Landing/constants/constants";

import OverviewBeam from "./constants/animated-beam";

const Overview = () => {
  return (
    <section id="overview" className="section">
      <div className="landing-container relative px-2">
        {/* The beam/diagram visualization */}
        <motion.figure
          className="mx-auto overflow-visible"
          initial="start"
          variants={variants.fadeInUp}
          whileInView={"end"}
          viewport={{ once: true }}
        >
          <OverviewBeam />
        </motion.figure>

        {/* Text content area */}
        <motion.div
          className="flex flex-wrap justify-center items-center text-center gap-5 md:gap-10 lg:gap-16 xl:gap-24 w-full mx-auto my-20"
          variants={variants.staggerContainer}
          initial="start"
          whileInView={"end"}
          viewport={{ once: true }}
        >
          {overviewData.list.map(({ text, title }, index) => (
            <motion.div
              key={index}
              className="text-center px-4 md:px-6 max-w-xs"
              variants={variants.fadeInLeft}
            >
              <h3 className="text-3xl text-white">{title}</h3>
              <p className="text-slate-400">{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Overview;