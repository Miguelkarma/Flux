import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CurrencyInput from "@/components/DashboardComponents/CurrencyInput";

// mock lucide-react Banknote icon
jest.mock("lucide-react", () => ({
  Banknote: () => <div data-testid="banknote-icon">Banknote</div>,
}));

// mock shadcn/ui Dialog components
jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({
    children,
    open,
    onOpenChange,
  }: {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }) => (
    <div
      data-testid="mock-dialog"
      data-open={open}
      onClick={() => onOpenChange && onOpenChange(!open)}
    >
      {children}
    </div>
  ),
  DialogTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-trigger">{children}</div>
  ),
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-header">{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-title">{children}</div>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-description">{children}</div>
  ),
}));

// mock shadcn/ui ScrollArea component
jest.mock("@/components/ui/scroll-area", () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-scroll-area">{children}</div>
  ),
}));

const mockOnChange = jest.fn();
const mockCurrencies = [
  { code: "USD", name: "United States Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "JPY", name: "Japanese Yen" },
];

describe("currencyinput component", () => {
  beforeEach(() => {
    // clear mock calls
    mockOnChange.mockClear();
  });

  test("renders with select type", () => {
    render(
      <CurrencyInput
        label="From"
        value="USD"
        onChange={mockOnChange}
        currencies={mockCurrencies}
        type="select"
      />
    );

    expect(screen.getByTestId("selected-currency-display")).toHaveTextContent(
      "USD - United States Dollar"
    );
  });

  test("renders input type and allows number input", () => {
    render(
      <CurrencyInput
        label="Amount"
        value="100"
        onChange={mockOnChange}
        type="input"
      />
    );

    const input = screen.getByPlaceholderText("Enter amount");
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "200" } });
    expect(mockOnChange).toHaveBeenCalledWith("200");
  });

  describe("dialog functionality", () => {
    test("opens dialog and selects currency", () => {
      render(
        <CurrencyInput
          label="From"
          value=""
          onChange={mockOnChange}
          currencies={mockCurrencies}
          type="select"
        />
      );

      const selectButton = screen.getByText("Select currency");
      fireEvent.click(selectButton);

      const dialogTitle = screen.getByText("Select a currency");
      expect(dialogTitle).toBeInTheDocument();

      const euroOption = screen.getByText("EUR - Euro");
      fireEvent.click(euroOption);

      expect(mockOnChange).toHaveBeenCalledWith("EUR");
    });

    test("filters currencies correctly", () => {
      render(
        <CurrencyInput
          label="From"
          value=""
          onChange={mockOnChange}
          currencies={mockCurrencies}
          type="select"
        />
      );

      const selectButton = screen.getByText("Select currency");
      fireEvent.click(selectButton);

      const searchInput = screen.getByPlaceholderText("Search currency...");

      fireEvent.change(searchInput, { target: { value: "Euro" } });

      expect(screen.getByText("EUR - Euro")).toBeInTheDocument();
      expect(
        screen.queryByText("USD - United States Dollar")
      ).not.toBeInTheDocument();
    });
  });
});
