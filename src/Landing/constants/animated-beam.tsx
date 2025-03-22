"use client";

import type React from "react";
import { forwardRef, useRef } from "react";


import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/Animation/animated-beam";

import { Monitor, Laptop, Waypoints, Computer, Mouse, Keyboard, Server } from "lucide-react";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-16 items-center justify-center rounded-full border-2 bg-gradient-to-r from-[#98d7c2] via-[#00AEAE] to-[#167D7F] p-4 shadow-[0_0_25px_-10px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

export default function AnimatedBeamDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative flex h-[600px] w-full items-center justify-center overflow-hidden rounded-lg p-10 md:shadow-xl"
      ref={containerRef}
    >
      <div className="flex size-full max-h-[300px] max-w-3xl flex-col items-stretch justify-between gap-24">
       {/* circles */}
        <div className="flex flex-row items-center justify-between px-1 ">
          <Circle ref={div1Ref}>
            <Server className="h-full w-full" />
          </Circle>
          <Circle ref={div5Ref}>
            <Monitor className="h-full w-full" />
          </Circle>
        </div>

      
        <div className="flex flex-row items-center justify-between max-sm:justify-center px-1">
          <Circle ref={div2Ref}>
            <Laptop className="h-full w-full max-sm:relative max-sm:w-[2em]" />
          </Circle>
          <Circle ref={div4Ref} className="size-20 mx-16 max-sm:relative max-sm:size-15">
            <Waypoints className="h-full w-full max-sm:relative max-sm:w-[2em]" />
          </Circle>
          <Circle ref={div6Ref}>
            <Computer className="h-full w-full max-sm:relative max-sm:w-[2em]" />
          </Circle>
        </div>

        <div className="flex flex-row items-center justify-between px-1">
          <Circle ref={div3Ref}>
            <Mouse className="h-full w-full" />
          </Circle>
          <Circle ref={div7Ref}>
            <Keyboard className="h-full w-full" />
          </Circle>
        </div>
      </div>

      {/* curves  */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div4Ref}
        curvature={40}
        endYOffset={-25}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div4Ref}
        curvature={0}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div4Ref}
        curvature={-40}
        endYOffset={25}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div4Ref}
        curvature={40}
        endYOffset={-25}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div4Ref}
        curvature={0}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div7Ref}
        toRef={div4Ref}
        curvature={-40}
        endYOffset={25}
        reverse
      />
    </div>
  );
}
