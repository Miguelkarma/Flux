import { render, screen, waitFor } from "@testing-library/react";
import ExchangeRateTable from "../../DashboardPages/Pages/CurrencyExchange/ExchangeRateTable";
import { fetchExchangeRates } from "@/api/currencyAPI";

// Mock the API module
jest.mock("@/api/currencyAPI");
const mockedFetchExchangeRates = fetchExchangeRates as jest.MockedFunction<
  typeof fetchExchangeRates
>;

describe("ExchangeRateTable", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks after each test
  });

  test("displays loading state initially", () => {
    mockedFetchExchangeRates.mockImplementation(() => new Promise(() => {})); // Simulating a pending request

    render(<ExchangeRateTable />);

    expect(screen.getByText("Loading exchange rates...")).toBeInTheDocument();
  });

  test("displays exchange rates when data is loaded successfully", async () => {
    // Mock API response with sample exchange rates
    const mockRates = [
      { currency: "EUR", rate: 0.85 },
      { currency: "GBP", rate: 0.75 },
      { currency: "JPY", rate: 110.45 },
    ];

    mockedFetchExchangeRates.mockResolvedValue(mockRates);

    render(<ExchangeRateTable />);

    // Verify loading state initially
    expect(screen.getByText("Loading exchange rates...")).toBeInTheDocument();

    // Wait until exchange rates are displayed
    await waitFor(() => {
      expect(screen.getByText("EUR")).toBeInTheDocument();
    });

    // Ensure all currencies and their rates are displayed
    expect(screen.getByText("EUR")).toBeInTheDocument();
    expect(screen.getByText("GBP")).toBeInTheDocument();
    expect(screen.getByText("JPY")).toBeInTheDocument();
    expect(screen.getByText("0.85")).toBeInTheDocument();
    expect(screen.getByText("0.75")).toBeInTheDocument();
    expect(screen.getByText("110.45")).toBeInTheDocument();
  });

  test("displays error message when no exchange rates are available", async () => {
    mockedFetchExchangeRates.mockResolvedValue([]); // Simulating empty data response

    render(<ExchangeRateTable />);

    // Wait for error message to be displayed
    await waitFor(() => {
      expect(
        screen.getByText("No exchange rates available")
      ).toBeInTheDocument();
    });
  });

  test("handles API errors", async () => {
    // Mock console.error before the test to prevent log pollution
    const originalConsoleError = console.error;
    console.error = jest.fn();

    try {
      mockedFetchExchangeRates.mockRejectedValue(new Error("API Error")); // Simulating an API failure

      render(<ExchangeRateTable />);

      // Wait for fallback error message
      await waitFor(() => {
        expect(
          screen.getByText("No exchange rates available")
        ).toBeInTheDocument();
      });

      // Verify that the error is logged
      expect(console.error).toHaveBeenCalledWith(
        "Failed to fetch exchange rates:",
        expect.any(Error)
      );
    } finally {
      console.error = originalConsoleError; // Restore original console.error
    }
  });
});
