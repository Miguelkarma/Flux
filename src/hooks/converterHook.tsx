import { useState, useEffect, useCallback, useRef } from "react";
import {
  ExchangeRate,
  fetchCurrencies,
  fetchExchangeRate,
  fetchExchangeRates,
} from "@/api/currencyAPI";
import { debounce } from "lodash";

export const useCurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currencies, setCurrencies] = useState<
    { code: string; name: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);

  // Fetch available currencies on mount
  useEffect(() => {
    const fetchCurrencyList = async () => {
      try {
        const data = await fetchCurrencies();
        setCurrencies(data);
      } catch {
        setError("Failed to fetch currency list. Please try again later.");
      }
    };

    fetchCurrencyList();
  }, []);

  // Fetch exchange rate when currencies change
  useEffect(() => {
    if (!fromCurrency || !toCurrency) return;
    setIsLoading(true);
    setError(null);

    const fetchRate = async () => {
      try {
        const rate = await fetchExchangeRate(fromCurrency, toCurrency);
        if (rate) setExchangeRate(rate);
        else throw new Error("Invalid exchange rate received.");
      } catch {
        setError("Failed to fetch exchange rate.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRate();
  }, [fromCurrency, toCurrency]);

  // Fetch all exchange rates (PHP)
  useEffect(() => {
    const getExchangeRates = async () => {
      const rates = await fetchExchangeRates();
      setExchangeRates(rates);
    };

    getExchangeRates();
  }, []);

  // Debounce amount input change
  const debounceRef = useRef(
    debounce((value: number) => {
      if (value > 0) setAmount(value);
    }, 500)
  );

  const handleAmountChange = useCallback((value: number) => {
    debounceRef.current(value);
  }, []);

  // Calculate conversion
  useEffect(() => {
    if (exchangeRate !== null) {
      setConvertedAmount(amount * exchangeRate);
    }
  }, [amount, exchangeRate]);

  return {
    amount,
    fromCurrency,
    toCurrency,
    convertedAmount,
    isLoading,
    currencies,
    exchangeRates,
    error,
    setFromCurrency,
    setToCurrency,
    handleAmountChange,
    exchangeRate,
  };
};
