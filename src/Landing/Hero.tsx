import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ParticlesBackground from "./Animation/ParticlesBackground";
import "@/styles/Hero.css";

export default function Hero() {
  return (
    <>
      <ParticlesBackground />
      <section className="container hero flex min-h-[calc(100vh-3.5rem)] max-w-screen-2xl flex-col items-center justify-center space-y-8 py-24 text-center md:py-32 mt-16">
        <div className="space-y-4">
          <h1 className=" bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
            Track Assets Faster with
            <br />
            Tech Track
          </h1>
          <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Simplify asset management by providing a seamless way to monitor,
            organize, and maintain your resources in real-time.
          </p>
        </div>
        <div className="flex gap-4">
          <Button size="lg">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </>
  );
}
