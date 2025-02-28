import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge Component", () => {
  test("renders with default variant", () => {
    render(<Badge>Default Badge</Badge>);
    const badgeElement = screen.getByText("Default Badge");
    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveClass("bg-primary text-primary-foreground");
  });

  test("renders with secondary variant", () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>);
    const badgeElement = screen.getByText("Secondary Badge");
    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveClass("bg-secondary text-secondary-foreground");
  });

  test("renders with destructive variant", () => {
    render(<Badge variant="destructive">Destructive Badge</Badge>);
    const badgeElement = screen.getByText("Destructive Badge");
    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveClass(
      "bg-destructive text-destructive-foreground"
    );
  });

  test("renders with outline variant", () => {
    render(<Badge variant="outline">Outline Badge</Badge>);
    const badgeElement = screen.getByText("Outline Badge");
    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveClass("text-foreground");
  });
});
