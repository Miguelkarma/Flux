import axios from "axios";

const CURRENCY_LIST_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json";

export async function fetchCurrencies() {
  const response = await axios.get(CURRENCY_LIST_URL);
  return Object.entries(response.data).map(([code, name]) => ({
    code: code.toLowerCase(),
    name: typeof name === "string" ? name : code.toUpperCase(),
  }));
}

export async function fetchExchangeRate(from: string, to: string) {
  const response = await axios.get(
    `https://api.exchangerate-api.com/v4/latest/${from.toUpperCase()}`
  );
  return response.data.rates[to.toUpperCase()] || null;
}

export interface ExchangeRate {
  currency: string;
  rate: number;
}

export const fetchExchangeRates = async (): Promise<ExchangeRate[]> => {
  try {
    const response = await axios(
      "https://api.exchangerate-api.com/v4/latest/USD"
    );
    if (!response.data) {
      throw new Error("Failed to fetch exchange rates");
    }
    const data = response.data;
    return Object.entries(data.rates).map(([currency, rate]) => ({
      currency,
      rate: rate as number,
    }));
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    return [];
  }
};
