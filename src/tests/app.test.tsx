import { render, screen } from "@testing-library/react";
import App from "@/App";
import "@testing-library/jest-dom";

jest.mock("@/Landing/Navbar", () => () => (
  <div data-testid="navbar">Navbar</div>
));
jest.mock("@/Landing/Hero", () => () => <div data-testid="hero">Hero</div>);
jest.mock("@/Landing/Features", () => () => (
  <div data-testid="features">Features</div>
));
jest.mock("@/Landing/CTA", () => () => <div data-testid="cta">CTA</div>);
jest.mock("@/Landing/Footer", () => () => (
  <div data-testid="footer">Footer</div>
));
jest.mock("@/Landing/Animation/MouseMoveEffect", () => () => (
  <div data-testid="mouse-effect">MouseMoveEffect</div>
));

describe("App Component", () => {
  it("renders all sections correctly", () => {
    render(<App />);

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("hero")).toBeInTheDocument();
    expect(screen.getByTestId("features")).toBeInTheDocument();
    expect(screen.getByTestId("cta")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByTestId("mouse-effect")).toBeInTheDocument();
  });
});
