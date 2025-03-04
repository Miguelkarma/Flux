"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  update: () => void;
  draw: () => void;
}

export default function DashboardParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const initParticles = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      resizeCanvas(); // Set initial size

      const particles: Particle[] = [];
      const particleCount = 100;

      class ParticleClass implements Particle {
        x: number;
        y: number;
        size: number;
        speedX: number;
        speedY: number;
        color: string;
        canvasWidth: number;
        canvasHeight: number;
        ctx: CanvasRenderingContext2D;

        constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
          this.canvasWidth = canvas.width;
          this.canvasHeight = canvas.height;
          this.ctx = ctx;
          this.x = Math.random() * this.canvasWidth;
          this.y = Math.random() * this.canvasHeight;
          this.size = Math.random() * 3 + 1;
          this.speedX = (Math.random() - 0.5) * 0.5;
          this.speedY = (Math.random() - 0.5) * 0.5;
          this.color = `rgba(${Math.floor(Math.random() * 100) + 100}, ${
            Math.floor(Math.random() * 100) + 150
          }, ${Math.floor(Math.random() * 55) + 200}, ${
            Math.random() * 0.5 + 0.2
          })`;
        }

        update() {
          this.x += this.speedX;
          this.y += this.speedY;

          if (this.x > this.canvasWidth) this.x = 0;
          if (this.x < 0) this.x = this.canvasWidth;
          if (this.y > this.canvasHeight) this.y = 0;
          if (this.y < 0) this.y = this.canvasHeight;
        }

        draw() {
          this.ctx.fillStyle = this.color;
          this.ctx.beginPath();
          this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }

      for (let i = 0; i < particleCount; i++) {
        particles.push(new ParticleClass(canvas, ctx)); // ✅ Fix: Pass both canvas and ctx
      }

      const animate = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const particle of particles) {
          particle.update();
          particle.draw();
        }

        requestAnimationFrame(animate);
      };

      animate();
    };

    initParticles();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-30"
    />
  );
}
