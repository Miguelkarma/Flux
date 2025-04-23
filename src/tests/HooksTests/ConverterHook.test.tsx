import { renderHook, act, waitFor } from "@testing-library/react";
import { useCurrencyConverter } from "@/hooks/converterHook";
import {
  fetchCurrencies,
  fetchExchangeRate,
  fetchExchangeRates,
} from "@/api/currencyAPI";

// mock api functions
jest.mock("@/api/currencyAPI", () => ({
  fetchCurrencies: jest.fn(),
  fetchExchangeRate: jest.fn(),
  fetchExchangeRates: jest.fn(),
}));

describe("useCurrencyConverter hook", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // reset mocks before each test
  });

  test("fetches currency list on mount", async () => {
    // mock api response
    (fetchCurrencies as jest.Mock).mockResolvedValue([
      { code: "USD", name: "United States Dollar" },
      { code: "EUR", name: "Euro" },
    ]);

    const { result } = renderHook(() => useCurrencyConverter());

    // verify currencies are loaded
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
      result.current.handleAmountChange(100); // simulate user input
    });

    await waitFor(() => expect(result.current.amount).toBe(100)); // verify update after debounce
  });

  test("fetches exchange rate when currencies change", async () => {
    (fetchExchangeRate as jest.Mock).mockResolvedValue(1.2);

    const { result } = renderHook(() => useCurrencyConverter());

    act(() => {
      result.current.setFromCurrency("USD");
      result.current.setToCurrency("EUR");
    });

    // verify exchange rate updates
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
      result.current.handleAmountChange(50); // simulate input
    });

    // verify conversion (50 * 1.2 = 60)
    await waitFor(() => {
      expect(result.current.convertedAmount).toBe(60);
    });
  });

  test("fetches all exchange rates", async () => {
    // mock api response
    (fetchExchangeRates as jest.Mock).mockResolvedValue([
      { currency: "USD", rate: 1 },
      { currency: "EUR", rate: 1.2 },
    ]);

    const { result } = renderHook(() => useCurrencyConverter());

    // verify exchange rates are fetched
    await waitFor(() => {
      expect(result.current.exchangeRates.length).toBeGreaterThan(0);
      expect(result.current.exchangeRates).toEqual([
        { currency: "USD", rate: 1 },
        { currency: "EUR", rate: 1.2 },
      ]);
    });
  });

  test("handles api errors", async () => {
    (fetchExchangeRate as jest.Mock).mockRejectedValue(new Error("API error"));

    const { result } = renderHook(() => useCurrencyConverter());

    act(() => {
      result.current.setFromCurrency("USD");
      result.current.setToCurrency("EUR");
    });

    // verify error state
    await waitFor(() => {
      expect(result.current.error).toBe("Failed to fetch exchange rate.");
    });
  });
});
