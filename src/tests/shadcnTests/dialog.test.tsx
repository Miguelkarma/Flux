import { render, screen, fireEvent } from "@testing-library/react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

jest.mock("lucide-react", () => ({
  X: () => <svg role="img" />,
}));

describe("Dialog Component", () => {
  test("renders DialogTrigger and opens DialogContent on click", () => {
    render(
      <Dialog>
        <DialogTrigger data-testid="dialog-trigger">Open Dialog</DialogTrigger>
        <DialogContent data-testid="dialog-content">
          <DialogTitle data-testid="dialog-title">Dialog Title</DialogTitle>
          <DialogDescription data-testid="dialog-description">
            Dialog Description
          </DialogDescription>
          <DialogClose data-testid="dialog-close">Close</DialogClose>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByTestId("dialog-trigger");
    fireEvent.click(trigger);

    const content = screen.getByTestId("dialog-content");
    expect(content).toBeInTheDocument();

    const title = screen.getByTestId("dialog-title");
    expect(title).toHaveTextContent("Dialog Title");

    const description = screen.getByTestId("dialog-description");
    expect(description).toHaveTextContent("Dialog Description");
  });

  test("closes DialogContent when clicking DialogClose", () => {
    render(
      <Dialog>
        <DialogTrigger data-testid="dialog-trigger">Open Dialog</DialogTrigger>
        <DialogContent data-testid="dialog-content">
          <DialogClose data-testid="dialog-close">Close</DialogClose>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByTestId("dialog-trigger");
    fireEvent.click(trigger);

    const content = screen.getByTestId("dialog-content");
    expect(content).toBeInTheDocument();

    const closeButton = screen.getByTestId("dialog-close");
    fireEvent.click(closeButton);

    expect(content).not.toBeInTheDocument();
  });
});
