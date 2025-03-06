import { render, screen } from "@testing-library/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

describe("Avatar Component", () => {
  test("renders Avatar component", () => {
    render(<Avatar data-testid="avatar" />);
    expect(screen.getByTestId("avatar")).toBeInTheDocument();
  });

  test("renders AvatarFallback when image is not available", () => {
    render(
      <Avatar>
        <AvatarFallback data-testid="avatar-fallback">AB</AvatarFallback>
      </Avatar>
    );
    const fallback = screen.getByTestId("avatar-fallback");
    expect(fallback).toBeInTheDocument();
    expect(fallback).toHaveTextContent("AB");
  });
});
