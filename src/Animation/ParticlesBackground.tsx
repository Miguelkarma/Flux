import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: false },
        particles: {
          number: {
            value: 100,
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
            value: 1,
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
            speed: 0.3,
          },
        },
      }}
      className="particles absolute inset-0 w-full h-full z-[-1]"
    />
  );
};

export default ParticlesBackground;
