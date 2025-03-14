import { renderHook, act, waitFor } from "@testing-library/react";
import { useCurrencyConverter } from "@/hooks/converterHook";
import {
  fetchCurrencies,
  fetchExchangeRate,
  fetchExchangeRates,
} from "@/api/currencyAPI";

// Mock API functions
jest.mock("@/api/currencyAPI", () => ({
  fetchCurrencies: jest.fn(),
  fetchExchangeRate: jest.fn(),
  fetchExchangeRates: jest.fn(),
}));

describe("useCurrencyConverter hook", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mock calls before each test
  });

  test("fetches currency list on mount", async () => {
    // Mock API response for currency list
    (fetchCurrencies as jest.Mock).mockResolvedValue([
      { code: "USD", name: "United States Dollar" },
      { code: "EUR", name: "Euro" },
    ]);

    const { result } = renderHook(() => useCurrencyConverter());

    // Ensure currencies are loaded correctly
    await waitFor(() => {
      expect(result.current.currencies.length).toBeGreaterThan(0);
      expect(result.current.currencies).toEqual([
        { code: "USD", name: "United States Dollar" },
        { code: "EUR", name: "Euro" },
      ]);
    });
  });

  test("updates amount with debounce", async () => {
    const { result } = renderHook(() => useCurrencyConverter());

    act(() => {
      result.current.handleAmountChange(100); // Simulate user input
    });

    await waitFor(() => expect(result.current.amount).toBe(100)); // Ensure value updates after debounce
  });

  test("fetches exchange rate when currencies change", async () => {
    (fetchExchangeRate as jest.Mock).mockResolvedValue(1.2);

    const { result } = renderHook(() => useCurrencyConverter());

    act(() => {
      result.current.setFromCurrency("USD");
      result.current.setToCurrency("EUR");
    });

    // Ensure exchange rate updates correctly
    await waitFor(() => {
      expect(result.current.exchangeRate).toBe(1.2);
    });
  });

  test("calculates converted amount correctly", async () => {
    (fetchExchangeRate as jest.Mock).mockResolvedValue(1.2);

    const { result } = renderHook(() => useCurrencyConverter());

    act(() => {
      result.current.setFromCurrency("USD");
      result.current.setToCurrency("EUR");
    });

    await waitFor(() => expect(result.current.exchangeRate).toBe(1.2));

    act(() => {
      result.current.handleAmountChange(50); // Simulate entering an amount
    });

    // Ensure conversion is correct (50 * 1.2 = 60)
    await waitFor(() => {
      expect(result.current.convertedAmount).toBe(60);
    });
  });

  test("fetches all exchange rates", async () => {
    // Mock API response for exchange rates
    (fetchExchangeRates as jest.Mock).mockResolvedValue([
      { currency: "USD", rate: 1 },
      { currency: "EUR", rate: 1.2 },
    ]);

    const { result } = renderHook(() => useCurrencyConverter());

    // Ensure all exchange rates are correctly fetched and stored
    await waitFor(() => {
      expect(result.current.exchangeRates.length).toBeGreaterThan(0);
      expect(result.current.exchangeRates).toEqual([
        { currency: "USD", rate: 1 },
        { currency: "EUR", rate: 1.2 },
      ]);
    });
  });

  test("handles API errors", async () => {
    (fetchExchangeRate as jest.Mock).mockRejectedValue(new Error("API error"));

    const { result } = renderHook(() => useCurrencyConverter());

    act(() => {
      result.current.setFromCurrency("USD");
      result.current.setToCurrency("EUR");
    });

    // Ensure error state is set correctly
    await waitFor(() => {
      expect(result.current.error).toBe("Failed to fetch exchange rate.");
    });
  });
});
