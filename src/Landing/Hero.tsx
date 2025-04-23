import { heroData } from "./constants/constants";

import { useRef } from "react";
import {
  motion,
  useSpring,
  useTransform,
  useReducedMotion,
  useScroll,
} from "motion/react";
import hero from "@/assets/hero.png";
import StartButton from "@/components/ui/getStartedButton";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  const heroBannerRef = useRef<HTMLElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const scale = useSpring(
    useTransform(scrollYProgress, [0, 0.5], [0.6, 1.13]),
    {
      damping: 20,
      restDelta: 0.01,
    }
  );

  return (
    <section ref={sectionRef} className="py-10 md:py-16 mt-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="landing-container text-center"
      >
        <div className="max-w-screen-md mx-auto">
          <p className="relative text-sm uppercase tracking-wider bg-zinc-900 border text-cyan-300 max-w-max mx-auto px-3 py-1 rounded-full border-t border-blue-500/10 backdrop-blur-3xl mb-6 md:mb-10 before:absolute before:left-1/2 before:translate-x-[-50%] before:bottom-[-1px] before:w-[66%] before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-sky-300 before:to-transparent before:rounded-full">
            {heroData.sectionSubtitle}
          </p>

          <h2 className="text-4xl font-semibold !leading-tight mb-4 max-sm:text-2xl md:text-5xl md:mb-5 lg:text-6xl text-gray-200">
            {heroData.sectionTitle}
            <span className="relative isolate ms-4 sm:inline-block sm:max-w-[493px] bg-gradient-to-t from-cyan-200 via-cyan-300 to-blue-800 bg-clip-text text-transparent pb-1 ">
              {heroData.decoTitle}
              <span className="absolute -z-10 top-2 -left-6 -right-4 bottom-0.5 bg-foreground/5 rounded-full px-8 ms-3 border-t border-foreground/20 shadow-[inset_0px_0px_30px_0px] shadow-foreground/20   md:top-3 md:bottom-1 lg:top-4 lg:bottom-2"></span>
            </span>
          </h2>

          <p className="text-slate-300 md:text-xl max-sm:text-xs">
            {heroData.sectionText}
          </p>

          <div className="flex justify-center gap-2 mt-6 md:mt-10 ">
            <StartButton
              onClick={() => {
                navigate("/login");
              }}
            ></StartButton>
          </div>
        </div>

        <div className="relative mt-12 mx-auto isolate rounded-xl md:mt-16 max-md:w-[40em] md:w-[40em] lg:h-auto lg:w-auto max-sm:h-[13em] max-sm:w-[20em]">
          <motion.figure
            ref={heroBannerRef}
            style={{
              scale: prefersReducedMotion ? 1 : scale,
              willChange: "transform",
              contain: "layout",
            }}
            className="bg-background/60 border border-slate-800 backdrop-blur-3xl rounded-xl shadow-2xl"
          >
            <div className="relative flex items-center bg-gray-800 border-b border-gray-800 rounded-t-xl py-2 px-4 ">
              <div className="flex gap-x-1 absolute top-1/2 left-4 -translate-y-1/2">
                <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
                <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
                <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
              </div>
              <div className="mx-auto text-sm text-gray-300">www.flux.com</div>
            </div>
            <img
              src={hero}
              alt="Flux Dashboard"
              loading="lazy"
              className="rounded-b-xl opacity-90 
              w-auto h-auto max-sm:h-[13em] max-sm:w-[20em] max-md:h-[30em] max-md:w-[40em] lg:h-auto lg:w-auto "
            />
          </motion.figure>

          <motion.div
            className="absolute bg-sky-200 inset-5 blur-[200px] -z-10 "
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "backInOut" }}
            style={{ willChange: "transform, opacity" }}
          />

          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "backOut" }}
            className="absolute inset-0 bg-cyan-400/80 blur-[300px] -z-10"
            style={{
              willChange: "transform, opacity",
              transform: "scale(1.25, 0.8)",
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
