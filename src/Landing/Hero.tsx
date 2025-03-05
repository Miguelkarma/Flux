import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ParticlesBackground from "../Animation/ParticlesBackground";
import "@/styles/Hero.css";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <>
      <div className=" absolute top-[-15em] left-1/2 transform -translate-x-1/2 h-[50vh] w-[90vw] max-w-[60em] bg-teal-500/30 blur-[50vw]  " />
      <div className="bg"></div>
      <ParticlesBackground />

      <section className=" container hero flex min-h-screen max-w-screen-2xl flex-col items-center justify-center space-y-8 py-32 text-center md:py-32">
        {/* Hero Title */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-[58rem] text-center"
        >
          <h1 className="bg-gradient-to-t from-foreground from-30%  to-foreground/70 bg-clip-text  tracking-tight text-transparent text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Track Assets Faster with
            <br />
            <span className="bg-gradient-to-t from-teal-200 via-teal-400 to-cyan-700 bg-clip-text ">
              Tech Track
            </span>
          </h1>

          {/* Hero Description */}
          <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 z-20 pt-2">
            Simplify asset management by providing a seamless way to monitor,
            organize, and maintain your resources in real-time.
          </p>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-[58rem] text-center"
        >
          <Button
            className="relative w-auto px-6 py-2 p-6 text-white bg-black border border-white/50 rounded-full transition-all hover:bg-black 
    before:absolute before:left-1/2 before:translate-x-[-50%] before:bottom-[-2px] before:w-[85%] before:h-[3px] before:bg-gradient-to-r before:from-transparent before:via-teal-500 before:to-transparent 
    hover:border-teal-500/30 before:rounded-full max-sm:text-md max-sm:p-4 
    group"
            onClick={() => {
              navigate("/registration");
            }}
          >
            <div
              className="absolute transition duration-300 opacity-70 -inset-px bg-gradient-to-r from-[#00ffea] via-[#2aeeeec9] to-[#00ffea] rounded-full blur-lg 
    group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-100 animate-tilt"
            />
            <span className="relative flex items-center gap-2">
              Get Started
              <ArrowRight className="h-4" />
            </span>
          </Button>
        </motion.button>
      </section>
    </>
  );
}
