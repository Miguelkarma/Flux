import { useState, useEffect } from "react";
import Loader from "./Animation/Loader";
import Header from "@/Landing/Header";
import Hero from "@/Landing/Hero";
import Brand from "./Landing/Brand";
import { ReactLenis } from "lenis/react";
import "./App.css";
import Features from "./Landing/Features";

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
      <div className="relative isolate overflow-hidden">
        {/* Header */}
        <Header />
        {/* Main Content */}
        <main>
          <Hero />
          <Brand />
          <Features/>
        </main>
      </div>
    </ReactLenis>
  );
}
