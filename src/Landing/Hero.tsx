import { heroData } from "./constants/constants";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import {
  motion,
  useSpring,
  useTransform,
  useReducedMotion,
  useScroll,
} from "motion/react";
import hero from "@/assets/hero.png";

export default function Hero() {
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
      stiffness: 100,
      damping: 20,
      restDelta: 0.01,
    }
  );

  return (
    <section ref={sectionRef} className="py-10 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container text-center"
      >
        <div className="max-w-screen-md mx-auto">
          <p className="text-sm uppercase tracking-wider bg-secondary/50 text-secondary-foreground max-w-max mx-auto px-3 py-1 rounded-full border-t border-blue-500/10 backdrop-blur-3xl mb-6 md:mb-10">
            {heroData.sectionSubtitle}
          </p>

          <h2 className="text-4xl font-semibold !leading-tight mb-4 md:text-5xl md:mb-5 lg:text-6xl">
            {heroData.sectionTitle}
            <span className="relative isolate ms-4">
              {heroData.decoTitle}
              <span className="absolute -z-10 top-2 -left-6 -right-4 bottom-0.5 bg-foreground/5 rounded-full px-8 ms-3 border-t border-foreground/20 shadow-[inset_0px_0px_30px_0px] shadow-foreground/20 md:top-3 md:bottom-1 lg:top-4 lg:bottom-2"></span>
            </span>
          </h2>

          <p className="text-muted-foreground md:text-xl">
            {heroData.sectionText}
          </p>

          <div className="flex justify-center gap-2 mt-6 md:mt-10">
            <Button>Get started</Button>
            <Button variant="ghost">Watch Demo</Button>
          </div>
        </div>

        <div className="relative mt-12 max-w-screen-xl mx-auto isolate rounded-xl md:mt-16">
          <motion.figure
            ref={heroBannerRef}
            style={{
              scale: prefersReducedMotion ? 1 : scale,
              willChange: "transform",
              contain: "layout",
            }}
            className="bg-background/60 border border-slate-800 backdrop-blur-3xl rounded-xl shadow-2xl"
          >
            <img
              src={hero}
              width={1300}
              height={815}
              alt="Flux Dashboard"
              loading="lazy"
              className="rounded-xl"
            />
          </motion.figure>

          <motion.div
            className="absolute bg-primary inset-5 blur-[40px] -z-10"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "backInOut" }}
            style={{ willChange: "transform, opacity" }}
          />

          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "backOut" }}
            className="absolute inset-0 bg-teal-500 blur-[200px] -z-10"
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
