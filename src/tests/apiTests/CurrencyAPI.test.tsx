import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  fetchCurrencies,
  fetchExchangeRate,
  fetchExchangeRates,
} from "@/api/currencyAPI";

const mock = new MockAdapter(axios);

describe("Currency API", () => {
  afterEach(() => {
    mock.reset(); // Ensures each test starts with a fresh mock instance.
  });

  test("fetchCurrencies should return a list of currencies", async () => {
    const mockData = { usd: "United States Dollar", eur: "Euro" };
    mock
      .onGet(
        "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json"
      )
      .reply(200, mockData);

    const currencies = await fetchCurrencies();
    expect(currencies).toEqual([
      { code: "usd", name: "United States Dollar" },
      { code: "eur", name: "Euro" },
    ]); // Ensures the function correctly transforms API response into expected format.
  });

  test("fetchExchangeRate should return the correct exchange rate", async () => {
    const mockData = { rates: { EUR: 0.85 } };
    mock
      .onGet("https://api.exchangerate-api.com/v4/latest/USD")
      .reply(200, mockData);

    const rate = await fetchExchangeRate("USD", "EUR");
    expect(rate).toBe(0.85); // Ensures the correct rate is extracted from API response.
  });

  test("fetchExchangeRates should return an array of exchange rates", async () => {
    const mockData = {
      rates: { EUR: 0.85, JPY: 110 },
    };
    mock
      .onGet("https://api.exchangerate-api.com/v4/latest/USD")
      .reply(200, mockData);

    const rates = await fetchExchangeRates();
    expect(rates).toEqual([
      { currency: "EUR", rate: 0.85 },
      { currency: "JPY", rate: 110 },
    ]); // Validates the function correctly formats multiple exchange rates.
  });

  test("fetchExchangeRate should return null if currency not found", async () => {
    const mockData = { rates: { EUR: 0.85 } };
    mock
      .onGet("https://api.exchangerate-api.com/v4/latest/USD")
      .reply(200, mockData);

    const rate = await fetchExchangeRate("USD", "XXX");
    expect(rate).toBeNull(); // Ensures function handles missing currency codes properly.
  });

  test("fetchExchangeRates should return an empty array if the API call fails", async () => {
    mock.onGet("https://api.exchangerate-api.com/v4/latest/USD").networkError();

    const rates = await fetchExchangeRates();
    expect(rates).toEqual([]); // Verifies error handling for network failures.
  });
});
