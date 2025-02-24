import "./App.css";
import Hero from "./Landing/HeroSection";
import Navbar from "./Landing/Navbar";
import Content from "./Landing/Content";
import Carousel from "./Landing/Carousel/Carousel";
import Reviews from "./Landing/Reviews";
import ParticlesBackground from "./Landing/Animation/ParticlesBackground";

function App() {
  return (
    <div className="flex flex-col min-h-screen ">
      <Navbar />
      <Hero />
      <Carousel />
      <Content />
      <ParticlesBackground />
      <Reviews />
    </div>
  );
}

export default App;
