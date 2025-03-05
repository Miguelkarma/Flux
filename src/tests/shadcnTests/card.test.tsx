import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

describe("Card Component", () => {
  test("renders Card component", () => {
    render(<Card>Card Content</Card>);
    const cardElement = screen.getByText("Card Content");
    expect(cardElement).toBeInTheDocument();
    expect(cardElement).toHaveClass(
      "rounded-xl border bg-card text-card-foreground shadow"
    );
  });

  test("renders CardHeader component", () => {
    render(<CardHeader>Header Content</CardHeader>);
    const headerElement = screen.getByText("Header Content");
    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toHaveClass("flex flex-col space-y-1.5 p-6");
  });

  test("renders CardTitle component", () => {
    render(<CardTitle>Title Content</CardTitle>);
    const titleElement = screen.getByText("Title Content");
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass(
      "font-semibold leading-none tracking-tight"
    );
  });

  test("renders CardDescription component", () => {
    render(<CardDescription>Description Content</CardDescription>);
    const descriptionElement = screen.getByText("Description Content");
    expect(descriptionElement).toBeInTheDocument();
    expect(descriptionElement).toHaveClass("text-sm text-muted-foreground");
  });

  test("renders CardContent component", () => {
    render(<CardContent>Content Section</CardContent>);
    const contentElement = screen.getByText("Content Section");
    expect(contentElement).toBeInTheDocument();
    expect(contentElement).toHaveClass("p-6 pt-0");
  });

  test("renders CardFooter component", () => {
    render(<CardFooter>Footer Content</CardFooter>);
    const footerElement = screen.getByText("Footer Content");
    expect(footerElement).toBeInTheDocument();
    expect(footerElement).toHaveClass("flex items-center p-6 pt-0");
  });
});
