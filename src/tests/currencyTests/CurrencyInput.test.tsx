import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CurrencyInput from "@/DashboardPages/Pages/CurrencyExchange/CurrencyInput";

// Mock the lucide-react module
jest.mock("lucide-react", () => ({
  X: () => <div data-testid="x-icon">X</div>,
}));

const mockOnChange = jest.fn();
const mockCurrencies = [
  { code: "USD", name: "United States Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "JPY", name: "Japanese Yen" },
];

describe("CurrencyInput Component", () => {
  beforeEach(() => {
    // Clear mock calls between tests
    mockOnChange.mockClear();
  });

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

    expect(screen.getByText("USD - United States Dollar")).toBeInTheDocument();
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

    fireEvent.change(input, { target: { value: "200" } });
    expect(mockOnChange).toHaveBeenCalledWith("200");
  });

  // Separate the dialog tests to handle potential issues
  describe("Dialog functionality", () => {
    test("opens currency selection dialog", () => {
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

      // Check if the dialog title is visible
      expect(screen.getByText("Select a currency")).toBeInTheDocument();
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

      // Open the dialog
      fireEvent.click(screen.getByText("Select currency"));

      // Filter the currency list
      fireEvent.change(screen.getByPlaceholderText("Search currency..."), {
        target: { value: "Euro" },
      });

      // Check if only Euro is visible
      expect(screen.getByText("EUR - Euro")).toBeInTheDocument();
      expect(
        screen.queryByText("USD - United States Dollar")
      ).not.toBeInTheDocument();
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

      // Open the dialog
      fireEvent.click(screen.getByText("Select currency"));

      // Select currency
      fireEvent.click(screen.getByText("EUR - Euro"));

      // Check if onChange was called with the right value
      expect(mockOnChange).toHaveBeenCalledWith("EUR");
    });
  });
});
