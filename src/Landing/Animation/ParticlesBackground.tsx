import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";
import "@/styles/particles.css";

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: false }, // Prevents taking over the whole screen
        particles: {
          number: {
            value: 70,
          },
          color: {
            value: "#ffffff",
          },
          shape: {
            type: "circle",
          },
          opacity: {
            value: 0.7,
          },
          size: {
            value: 2,
          },
          links: {
            enable: true,
            distance: 160,
            color: "#ffffff",
            opacity: 0.6,
            width: 1,
          },
          move: {
            enable: true,
            speed: 0.5,
          },
        },
      }}
      className="particles fixed inset-0 w-full h-full z-[-1]"
    />
  );
};

export default ParticlesBackground;
