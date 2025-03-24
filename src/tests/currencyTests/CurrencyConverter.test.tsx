import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CurrencyConverter from "@/DashboardPages/Pages/CurrencyExchange/currency-converter";
import { useCurrencyConverter } from "@/hooks/converterHook";

// Mock the hook to control its return values in tests
jest.mock("@/hooks/converterHook", () => ({
  useCurrencyConverter: jest.fn(),
}));

// Mock only the icon components since they don't affect the UI logic
jest.mock("lucide-react", () => ({
  ArrowRightLeft: ({ className }: { className?: string }) => (
    <div className={className}>Swap</div>
  ),
  RefreshCw: ({ className }: { className?: string }) => (
    <div className={className}>Loading Icon</div>
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

    // references the actual UI component instead of a mock
    const swapButton = screen.getByText("Swap");
    fireEvent.click(swapButton);

    expect(mockHook.setFromCurrency).toHaveBeenCalledWith("EUR");
    expect(mockHook.setToCurrency).toHaveBeenCalledWith("USD");
  });

  test("disables the convert button when loading", () => {
    (useCurrencyConverter as jest.Mock).mockReturnValueOnce({
      ...mockHook,
      isLoading: true,
    });

    render(<CurrencyConverter />);

    // actual button instead of a mocked one
    const convertButton = screen.getByRole("button", { name: /loading/i });

    expect(convertButton).toBeDisabled();
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
