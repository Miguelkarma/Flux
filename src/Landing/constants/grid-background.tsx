import { useEffect, useRef } from "react";

export function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      drawGrid();
    };

    const drawGrid = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // grid settings
      const gridSize = 120;
      const gridColor = "rgba(255, 255, 255, 0.04)";
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;

      // vertical lines
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // horizontal lines
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // horizontal fade (left/right)
      const gradientX = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradientX.addColorStop(0, "hsl(222.2, 84%, 4.9%)");
      gradientX.addColorStop(0, "rgba(0, 0, 0, 0)");
      gradientX.addColorStop(1, "rgba(0, 0, 0, 0)");
      gradientX.addColorStop(1, "hsl(222.2, 84%, 4.9%)");

      ctx.fillStyle = gradientX;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // vertical fade (top/bottom)
      const gradientY = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradientY.addColorStop(0, "hsl(222.2, 84%, 4.9%)");
      gradientY.addColorStop(0.2, "rgba(0, 0, 0, 0)");
      gradientY.addColorStop(0.7, "rgba(0, 0, 0, 0)");
      gradientY.addColorStop(1, "hsl(222.2, 84%, 4.9%)");

      ctx.fillStyle = gradientY;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // initial draw
    resizeCanvas();

    // observe container resize
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container);

    // handle window resize
    window.addEventListener("resize", resizeCanvas);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10 bg-transparent">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: "block" }}
      />
    </div>
  );
}
