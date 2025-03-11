import { render, screen, fireEvent } from "@testing-library/react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import "@testing-library/jest-dom";

describe("Drawer Component", () => {
  test("renders and opens drawer when triggered", () => {
    render(
      <Drawer>
        <DrawerTrigger data-testid="drawer-trigger">Open</DrawerTrigger>
        <DrawerContent
          data-testid="drawer-content"
          aria-describedby={undefined}
        >
          <DrawerTitle>Test Drawer</DrawerTitle>
          <DrawerDescription>Some helpful description</DrawerDescription>{" "}
          <p>Drawer Body</p>
        </DrawerContent>
      </Drawer>
    );

    // Drawer is not visible
    expect(screen.queryByTestId("drawer-content")).not.toBeInTheDocument();

    // Trigger for drawer
    fireEvent.click(screen.getByTestId("drawer-trigger"));

    // Drawer is now visible
    expect(screen.getByTestId("drawer-content")).toBeInTheDocument();
  });
});
