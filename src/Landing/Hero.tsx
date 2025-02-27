import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ParticlesBackground from "./Animation/ParticlesBackground";
import "@/styles/Hero.css";

export default function Hero() {
  return (
    <>
      {/* Background Blur Effect */}
      <div className="absolute top-[-15em] left-1/2 transform -translate-x-1/2 h-[50vh] w-[90vw] max-w-[60em] bg-teal-500/30 blur-[50vw]" />

      <ParticlesBackground />

      <section className="container hero flex min-h-screen max-w-screen-2xl flex-col items-center justify-center space-y-8 py-24 text-center md:py-32">
        {/* Hero Title */}
        <h1 className="bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text font-bold tracking-tight text-transparent text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
          Track Assets Faster with
          <br />
          Tech Track
        </h1>

        {/* Hero Description */}
        <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 z-20">
          Simplify asset management by providing a seamless way to monitor,
          organize, and maintain your resources in real-time.
        </p>

        {/* Call-To-Action Button */}
        <Button
          className="relative w-auto px-6 py-2 p-6 text-white bg-black border border-white/50 rounded-full transition-all hover:bg-black 
          before:absolute before:left-1/2 before:translate-x-[-50%] before:bottom-[-2px] before:w-[85%] before:h-[3px] before:bg-gradient-to-r before:from-transparent before:via-teal-500 before:to-transparent 
          hover:border-teal-500/30 before:rounded-full max-sm:text-md max-sm:p-4"
        >
          Get Started
          <ArrowRight className="h-4" />
        </Button>
      </section>
    </>
  );
}
