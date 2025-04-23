import { motion } from "motion/react";
import * as variants from "@/Animation/motionVariants";
import { processData } from "@/Landing/constants/constants";
import form from "@/assets/process.png";

const Process = () => {
  return (
    <section id="process" className="section mt-4 relative">
    
      <div className="container">
        <div className="section-head">
          <motion.p
            variants={variants.fadeInUp}
            initial="start"
            whileInView={"end"}
            viewport={{ once: true }}
            className="section-subtitle "
          >
            {processData.sectionSubtitle}
          </motion.p>
          <motion.h2
            variants={variants.fadeInUp}
            initial="start"
            whileInView={"end"}
            viewport={{ once: true }}
            className="section-title"
          >
            {processData.sectionTitle}
          </motion.h2>
          <motion.p
            variants={variants.fadeInUp}
            initial="start"
            whileInView={"end"}
            viewport={{ once: true }}
            className="section-text"
          >
            {processData.sectionText}
          </motion.p>
        </div>
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center ">
          <div className="grid gap-7 lg:gap-10">
            {processData.list.map(({ icon, text, title }, index) => (
              <motion.div
                className="flex flex-col gap-4 md:flex-row lg:gap-7"
                key={index}
                variants={variants.staggerContainer}
                initial="start"
                whileInView="end"
                viewport={{ once: true }}
              >
                <motion.div
                  className="w-16 h-16 grid place-items-center rounded-full border border-foreground/5 shrink-0 bg-slate-800"
                  variants={variants.fadeInScale}
                >
                  {icon}
                </motion.div>
                <div className="grid gap-2 md:gap-3">
                  <motion.h3
                    className="text-xl lg:text-2xl text-cyan-300"
                    variants={variants.fadeInLeft}
                  >
                    {title}
                  </motion.h3>
                  <motion.p
                    className="text-sm text-slate-300 md:text-base"
                    variants={variants.fadeInLeft}
                  >
                    {text}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="max-lg:-order-1">
            <motion.figure
              variants={variants.fadeInUp}
              initial="start"
              whileInView={"end"}
              viewport={{ once: true }}
              className="mx-auto bg-slate-800/60 rounded-3xl max-w-[580px] overflow-hidden p-8 !pb-0
            lg:p-12 "
            >
              <img
                src={form}
                alt="Flux Dashboard"
                className="w-full h-full object-contain object-center rounded-t-xl"
              />
            </motion.figure>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Process;
