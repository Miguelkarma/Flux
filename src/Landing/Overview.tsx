import { motion } from "motion/react";
import * as variants from "@/Animation/motionVariants";
import { overviewData } from "@/Landing/constants/constants";

import OverviewBeam from "./constants/animated-beam";

const Overview = () => {
  return (
    <section id="overview" className="section ">
      <div className="container">
        <figure className="">
          <OverviewBeam />
        </figure>

        <motion.div
          className="flex flex-wrap justify-center items-center text-center gap-5 md:gap-10 xl:gap-64 w-full mx-auto lg:ml-3 md:ml-7 sm:ml-7 max-sm:ml-0 my-20"
          variants={variants.staggerContainer}
          initial="start"
          whileInView={"end"}
          viewport={{ once: true }}
        >
          {overviewData.list.map(({ text, title }, index) => (
            <motion.div
              key={index}
              className="text-center"
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
