import { motion } from "motion/react";
import * as variants from "@/Animation/motionVariants";
import { overviewData } from "@/Landing/constants/constants";
import log from "@/assets/log.jpg";

const Overview = () => {
  return (
    <section className="">
      <div className="container">
        <div className="section-head">
          <motion.p
            variants={variants.fadeInUp}
            initial="start"
            whileInView={"end"}
            viewport={{ once: true }}
            className="section-subtitle"
          >
            {overviewData.sectionSubtitle}
          </motion.p>
          <motion.h2
            variants={variants.fadeInUp}
            initial="start"
            whileInView={"end"}
            viewport={{ once: true }}
            className="section-title"
          >
            {overviewData.sectionTitle}
          </motion.h2>
          <motion.p
            variants={variants.fadeInUp}
            initial="start"
            whileInView={"end"}
            viewport={{ once: true }}
            className="section-text"
          >
            {overviewData.sectionText}
          </motion.p>
        </div>
        <motion.div
          className="relative max-w-4xl mx-auto shadow-xl"
          variants={variants.fadeInScale}
          initial="start"
          whileInView={"end"}
          viewport={{ once: true }}
        >
          <figure className="">
            <img src={log} width={900} height={601} alt="" />
          </figure>
        </motion.div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 gap-5 mt-8 md:mt-16 xl:grid-cols[3fr,2.5fr] xl:items-center">
          <motion.p
            className="section-title text-center lg:max-w-[30ch] lg:mx-auto xl:text-left"
            variants={variants.fadeInRight}
            initial="start"
            whileInView={"end"}
            viewport={{ once: true }}
          >
            {overviewData.listTitle}
          </motion.p>
          <motion.div
            className="flex flex-wrap justify-center gap-5 md:gap-10 xl:gap-8"
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
                <h3 className="text-3xl">{title}</h3>
                <p className="text-muted-foreground">{text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Overview;
