import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CurrencyConverter from "@/DashboardPages/Pages/CurrencyExchange/currency-converter";
import { useCurrencyConverter } from "@/hooks/converterHook";

// Mock the hook
jest.mock("@/hooks/converterHook", () => ({
  useCurrencyConverter: jest.fn(),
}));

// Mock the UI components with proper TypeScript typing
jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    disabled,
    className,
    variant,
    size,
    title,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    variant?: string;
    size?: string;
    title?: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-variant={variant}
      data-size={size}
      title={title}
    >
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/input", () => ({
  Input: ({
    id,
    type,
    min,
    step,
    defaultValue,
    onChange,
    placeholder,
  }: {
    id?: string;
    type?: string;
    min?: string;
    step?: string;
    defaultValue?: number;
    onChange?: (e: { target: { value: string } }) => void;
    placeholder?: string;
  }) => (
    <input
      id={id}
      type={type}
      min={min}
      step={step}
      defaultValue={defaultValue}
      onChange={onChange}
      placeholder={placeholder}
    />
  ),
}));

jest.mock("lucide-react", () => ({
  ArrowRightLeft: ({ className }: { className?: string }) => (
    <div className={className}>Swap</div>
  ),
  RefreshCw: ({ className }: { className?: string }) => (
    <div className={className}>Loading Icon</div>
  ),
}));

// Mock the CurrencyInput component with proper typing
jest.mock("@/DashboardPages/Pages/CurrencyExchange/CurrencyInput", () => ({
  __esModule: true,
  default: ({
    label,
    value,
    onChange
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    currencies: Array<{ code: string; name: string }>;
  }) => (
    <div data-testid={`mock-currency-input-${label}`}>
      Mocked CurrencyInput: {label} - {value}
      <button onClick={() => onChange("TEST")}>Change</button>
    </div>
  ),
}));

// Mock for shadcn Card components
jest.mock("@/components/ui/card", () => ({
  Card: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
  CardHeader: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
  CardTitle: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
  CardDescription: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardContent: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
  CardFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
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
    expect(screen.getByText("Currency Converter")).toBeInTheDocument();
    expect(screen.getByTestId("mock-currency-input-From")).toBeInTheDocument();
    expect(screen.getByTestId("mock-currency-input-To")).toBeInTheDocument();
  });

  test("swaps currencies when swap button is clicked", () => {
    render(<CurrencyConverter />);
    // Find the swap button by the Swap text (which is from our mocked ArrowRightLeft component)
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

    const convertButton = screen.getByText("Loading...");


    expect(convertButton).toBeDisabled();
  });

  test("display an error message when there is an error", () => {
    (useCurrencyConverter as jest.Mock).mockReturnValueOnce({
      ...mockHook,
      error: "Invalid currency selection",
    });

    render(<CurrencyConverter />);
    expect(screen.getByText("Invalid currency selection")).toBeInTheDocument();
  });
});
