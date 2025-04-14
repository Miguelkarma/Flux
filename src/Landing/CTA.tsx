import { motion } from "motion/react";
import * as variants from "@/Animation/motionVariants";
import { ctaData } from "./constants/constants";
import CTApic from "@/assets/CTA.jpg";
import CtaButton from "@/components/ui/ctaButton";

export default function CTA() {
  return (
    <section id="cta" className="section ">
      <div className="container ">
        <motion.div
          variants={variants.fadeInUp}
          initial="start"
          whileInView="end"
          viewport={{ once: true }}
          className="bg-gradient-to-tl from-transparent via-indigo-950/10 to-indigo-400/80 rounded-xl border-t border-primary-foreground/30 overflow-hidden grid grid-cols-1 lg:grid-cols-[1fr,0.7fr] lg:items-center border-none  "
        >
          <div className="p-8 md:p-16 xl:p-20 ">
            <motion.h2
              className="text-[26px] leading-tight font-semibold mb-6 capitalize sm:text-[34px] md:text-[40px] lg:text-[46px] lg:mb-10 text-white"
              variants={variants.fadeIn}
              initial="start"
              whileInView="end"
              viewport={{ once: true }}
            >
              {ctaData.text}
            </motion.h2>
            <motion.div
              className="flex items-center gap-3 lg:gap-4"
              variants={variants.fadeIn}
              initial="start"
              whileInView="end"
              viewport={{ once: true }}
            >
              {" "}
              <CtaButton />
            </motion.div>
          </div>
          <motion.figure
            className="-order-1 pt-14 ps-8 sm:ps-12 md:ps-14 lg:order-none lg:p-0"
            variants={variants.fadeInLeft}
            initial="start"
            whileInView="end"
            viewport={{ once: true }}
          >
            <img
              src={CTApic}
              alt="pricelol"
              className="w-full h-full object-contain object-right rounded-l-2xl"
            />
          </motion.figure>
        </motion.div>
      </div>
    </section>
  );
}
