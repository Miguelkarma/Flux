import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { act } from "react-dom/test-utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

describe("DropdownMenu", () => {
  it("renders the dropdown menu trigger", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger data-testid="dropdown-trigger">
          Open Menu
        </DropdownMenuTrigger>
        <DropdownMenuContent forceMount>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(screen.getByTestId("dropdown-trigger")).toBeInTheDocument();
  });

  it("opens the menu when clicked", async () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger data-testid="dropdown-trigger">
          Open Menu
        </DropdownMenuTrigger>
        <DropdownMenuContent forceMount data-testid="dropdown-content">
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const trigger = screen.getByTestId("dropdown-trigger");

    await act(async () => {
      fireEvent.click(trigger);
    });

    expect(await screen.findByTestId("dropdown-content")).toBeVisible();
  });

  it("displays menu items when opened", async () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger data-testid="dropdown-trigger">
          Open Menu
        </DropdownMenuTrigger>
        <DropdownMenuContent forceMount>
          <DropdownMenuItem data-testid="menu-item">Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(await screen.findByTestId("menu-item")).toBeVisible();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
  });
});
