import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button Component", () => {
  test("renders with default variant and size", () => {
    render(<Button>Default Button</Button>);
    const buttonElement = screen.getByText("Default Button");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
    );
    expect(buttonElement).toHaveClass("h-9 px-4 py-2");
  });

  test("renders with secondary variant", () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const buttonElement = screen.getByText("Secondary Button");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass("bg-secondary text-secondary-foreground");
  });

  test("renders with destructive variant", () => {
    render(<Button variant="destructive">Destructive Button</Button>);
    const buttonElement = screen.getByText("Destructive Button");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass(
      "bg-destructive text-destructive-foreground"
    );
  });

  test("renders with outline variant", () => {
    render(<Button variant="outline">Outline Button</Button>);
    const buttonElement = screen.getByText("Outline Button");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
    );
  });

  test("renders with small size", () => {
    render(<Button size="sm">Small Button</Button>);
    const buttonElement = screen.getByText("Small Button");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass("h-8 rounded-md px-3 text-xs");
  });

  test("renders with large size", () => {
    render(<Button size="lg">Large Button</Button>);
    const buttonElement = screen.getByText("Large Button");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass("h-10 rounded-md px-8");
  });

  test("renders as a link when asChild is true", () => {
    render(
      <Button asChild>
        <a href="#">Link Button</a>
      </Button>
    );
    const linkElement = screen.getByText("Link Button");
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.tagName).toBe("A");
  });
});
