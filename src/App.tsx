import { useState, useEffect } from "react";
import Loader from "./Animation/Loader";
import Header from "@/Landing/Header";
import Hero from "@/Landing/Hero";
import Brand from "./Landing/Brand";
import { ReactLenis } from "lenis/react";
import "./App.css";
import Features from "./Landing/Features";
import Process from "./Landing/Process";
import Overview from "./Landing/Overview";
import Review from "./Landing/Review";
import Blog from "./Landing/Blog";
import CTA from "./Landing/CTA";
import Footer from "./Landing/Footer";
import { GridBackground } from "./Landing/constants/grid-background";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer); // Cleanup to prevent memory leaks
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Loader />
      </div>
    );
  }

  return (
    <ReactLenis root>
      <div className="relative isolate overflow-hidden bg-[hsl(222.2,84%,4.9%)]">
        {/* Header */}
        <Header />
        {/* Main Content */}
        <main>
          <Hero />
          <Brand />
          <div className=" relative">
            <GridBackground />
            <div className="container">
              <Features />
              <Process />
              <Overview />
            </div>
          </div>
          <Review />
          <Blog />
          <CTA />
        </main>
        <Footer />
      </div>
    </ReactLenis>
  );
}
