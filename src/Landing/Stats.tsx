import { memo } from "react";
import { motion } from "framer-motion";
import * as variants from "@/Animation/motionVariants";
import { brandTagline, statsSection } from "./constants/constants";

const Stats = () => {
  return (
    <section className="section text-gray-100">
      <div className="landing-container max-w-screen-lg">
        <motion.p
          variants={variants.fadeInUp}
          initial="start"
          whileInView="end"
          viewport={{ once: true, amount: 0.1 }}
          className="text-center mb-4 md:mb-6"
          aria-label="Brand tagline"
        >
          {brandTagline}
        </motion.p>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="rounded-2xl py-10 px-10 xl:py-16 xl:px-20 bg-slate-900/90 flex items-center justify-between flex-col gap-16 lg:flex-row"
              variants={variants.fadeInUp}
              initial="start"
              whileInView="end"
              viewport={{ once: true, amount: 0.1 }}
            >
              <motion.div
                className="w-full lg:w-60"
                variants={variants.fadeInUp}
              >
                <h2 className="font-manrope text-4xl font-bold text-cyan-300 mb-4 text-center lg:text-left">
                  {statsSection.title}
                </h2>
                <p className="text-sm text-gray-400 leading-6 text-center lg:text-left">
                  {statsSection.description}
                </p>
              </motion.div>
              <div className="w-full lg:w-4/5">
                <motion.div
                  className="flex flex-col flex-1 gap-10 lg:gap-0 lg:flex-row lg:justify-between"
                  variants={variants.fadeInUp}
                  transition={{ staggerChildren: 0.15 }}
                >
                  {statsSection.stats.map((stats, index) => (
                    <motion.div
                      key={index}
                      className="block"
                      variants={variants.fadeInUp}
                    >
                      <div className="font-manrope font-bold text-4xl text-cyan-300 mb-3 text-center lg:text-left">
                        {stats.value}
                      </div>
                      <span className="text-gray-300 text-center block lg:text-left">
                        {stats.label}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default memo(Stats);
