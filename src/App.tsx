import Navbar from "@/Landing/Navbar";
import Hero from "@/Landing/Hero";
import Features from "@/Landing/Features";
import CTA from "@/Landing/CTA";
import Footer from "@/Landing/Footer";
import MouseMoveEffect from "./Landing/Animation/MouseMoveEffect";

export default function Home() {
  return (
    <div className="hero relative min-h-screen">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="absolute left-0 top-0 h-[500px] w-[500px] bg-cyan-500/30 blur-[200px]" />
        <div className="absolute bottom-20 right-0 h-[500px] w-[500px] bg-purple-600/20 blur-[200px]" />
      </div>

      <div className="relative z-10">
        <MouseMoveEffect />
        <Navbar />
        <Hero />
        <Features />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}
