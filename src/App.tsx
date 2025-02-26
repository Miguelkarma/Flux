import Navbar from "@/Landing/Navbar";
import Hero from "@/Landing/Hero";
import Features from "@/Landing/Features";
import CTA from "@/Landing/CTA";
import Footer from "@/Landing/Footer";
import MouseMoveEffect from "./Landing/Animation/MouseMoveEffect";
import "./App.css";

export default function Home() {
  return (
    <div className="hero relative min-h-screen">
      <div className="pointer-events-none fixed inset-0">
        <div className=" inset-0 bg-gradient-to-b from-background via-background to-black" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <MouseMoveEffect />
        <div className="bg-grid">
          <Hero />
        </div>
        <Features />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}
