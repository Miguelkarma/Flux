import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CurrencyInput from "@/DashboardPages/Pages/CurrencyExchange/CurrencyInput";

// Mocking the Dialog components to simplify testing
jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTrigger: ({ children }: { children: React.ReactNode }) => (
    <button>{children}</button>
  ),
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
}));

const mockOnChange = jest.fn();
const mockCurrencies = [
  { code: "USD", name: "United States Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "JPY", name: "Japanese Yen" },
];

describe("CurrencyInput Component", () => {
  test("renders correctly with select type", () => {
    render(
      <CurrencyInput
        label="From"
        value="USD"
        onChange={mockOnChange}
        currencies={mockCurrencies}
        type="select"
      />
    );
    // Check if the default currency is displayed
    expect(
      screen.getAllByText("USD - United States Dollar")[0]
    ).toBeInTheDocument();
  });

  test("opens currency selection dialog and filters correctly", () => {
    render(
      <CurrencyInput
        label="From"
        value=""
        onChange={mockOnChange}
        currencies={mockCurrencies}
        type="select"
      />
    );

    // Open the currency selection dialog
    fireEvent.click(screen.getByText("Select currency"));
    expect(screen.getByText("Select a currency")).toBeInTheDocument();

    // Filter the currency list
    fireEvent.change(screen.getByPlaceholderText("Search currency..."), {
      target: { value: "Euro" },
    });
    expect(screen.getByText("EUR - Euro")).toBeInTheDocument();
  });

  test("selects a currency and triggers onChange", () => {
    render(
      <CurrencyInput
        label="From"
        value=""
        onChange={mockOnChange}
        currencies={mockCurrencies}
        type="select"
      />
    );

    fireEvent.click(screen.getByText("Select currency"));
    fireEvent.click(screen.getByText("EUR - Euro")); // Select currency
    expect(mockOnChange).toHaveBeenCalledWith("EUR");
  });

  test("renders input type correctly and allows number input", () => {
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

    fireEvent.change(input, { target: { value: "200" } }); // Simulate input change
    expect(mockOnChange).toHaveBeenCalledWith("200");
  });
});
