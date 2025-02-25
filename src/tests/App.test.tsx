import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import App from "../App";

// Mocking child components to avoid rendering full UI
jest.mock("../Landing/Navbar", () => () => (
  <div data-testid="navbar">Navbar</div>
));
jest.mock("../Landing/HeroSection", () => () => (
  <div data-testid="hero">Hero</div>
));
jest.mock("../Landing/Carousel/Carousel", () => () => (
  <div data-testid="carousel">Carousel</div>
));
jest.mock("../Landing/Content", () => () => (
  <div data-testid="content">Content</div>
));
jest.mock("../Landing/Animation/ParticlesBackground", () => () => (
  <div data-testid="particles">Particles</div>
));
jest.mock("../Landing/Reviews", () => () => (
  <div data-testid="reviews">Reviews</div>
));

describe("App Component", () => {
  test("renders all sections correctly", () => {
    render(<App />);

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("hero")).toBeInTheDocument();
    expect(screen.getByTestId("carousel")).toBeInTheDocument();
    expect(screen.getByTestId("content")).toBeInTheDocument();
    expect(screen.getByTestId("particles")).toBeInTheDocument();
    expect(screen.getByTestId("reviews")).toBeInTheDocument();
  });
});
