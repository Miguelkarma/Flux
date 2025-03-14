import { useState, useEffect } from "react";
import Loader from "./Animation/Loader";
import Navbar from "@/Landing/Navbar";
import Hero from "@/Landing/Hero";
import Features from "@/Landing/Features";
import CTA from "@/Landing/CTA";
import Footer from "@/Landing/Footer";
import MouseMoveEffect from "./Animation/MouseMoveEffect";
import "./App.css";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <div className="pointer-events-none fixed inset-0">
        <div className="inset-0 bg-gradient-to-b from-background via-background to-black" />
      </div>
      <div className="relative z-10 flex flex-col flex-grow">
        <Navbar />
        <MouseMoveEffect />
        <div className="flex flex-col flex-grow items-center justify-center bg-mask">
          <Hero />
        </div>
        <Features />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}
