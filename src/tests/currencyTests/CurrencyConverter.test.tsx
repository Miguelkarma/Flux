import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CurrencyConverter from "@/components/DashboardComponents/currency-converter";
import { useCurrencyConverter } from "@/hooks/converterHook";

// Mock the hook to control its return values in tests
jest.mock("@/hooks/converterHook", () => ({
  useCurrencyConverter: jest.fn(),
}));

// mock lucide
jest.mock("lucide-react", () => ({
  ChevronsUpDown: ({ className }: { className?: string }) => (
    <div className={className}>Swap</div>
  ),
  CircleDollarSign: ({ className }: { className?: string }) => (
    <div className={className}>Currency Icon</div>
  ),
}));

describe("CurrencyConverter Component", () => {
  const mockHook = {
    amount: 100,
    fromCurrency: "USD",
    toCurrency: "EUR",
    convertedAmount: 90.5,
    isLoading: false,
    currencies: [
      { code: "USD", name: "United States Dollar" },
      { code: "EUR", name: "Euro" },
    ],
    exchangeRates: [
      { currency: "USD", rate: 1 },
      { currency: "EUR", rate: 0.85 },
    ],
    error: null,
    setFromCurrency: jest.fn(),
    setToCurrency: jest.fn(),
    handleAmountChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useCurrencyConverter as jest.Mock).mockReturnValue(mockHook);
  });

  test("renders correctly", () => {
    render(<CurrencyConverter />);

    //  renders actual components instead of mocked ones
    expect(screen.getByText("Currency Converter")).toBeInTheDocument();
  });

  test("swaps currencies when swap button is clicked", () => {
    render(<CurrencyConverter />);
    const swapButton = screen.getByTitle("Swap currencies");
    fireEvent.click(swapButton);

    expect(mockHook.setFromCurrency).toHaveBeenCalledWith("EUR");
    expect(mockHook.setToCurrency).toHaveBeenCalledWith("USD");
  });

  test("displays the correct converted amount", () => {
    render(<CurrencyConverter />);

    const resultText = screen.getByText("100 USD = 90.5000 EUR");
    expect(resultText).toBeInTheDocument();
  });

  test("displays an error message when there is an error", () => {
    (useCurrencyConverter as jest.Mock).mockReturnValueOnce({
      ...mockHook,
      error: "Invalid currency selection",
    });

    render(<CurrencyConverter />);

    // Verifying actual error message rendering
    expect(screen.getByText("Invalid currency selection")).toBeInTheDocument();
  });
});
