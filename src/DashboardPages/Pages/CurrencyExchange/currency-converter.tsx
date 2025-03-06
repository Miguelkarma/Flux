"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, RefreshCw } from "lucide-react";
import { useCurrencyConverter } from "@/hooks/converterHook";
import CurrencyInput from "./CurrencyInput";
import { useCallback } from "react";

export default function CurrencyConverter() {
  const {
    amount,
    fromCurrency,
    toCurrency,
    convertedAmount,
    isLoading,
    currencies,
    error,
    setFromCurrency,
    setToCurrency,
    handleAmountChange,
  } = useCurrencyConverter();

  const handleSwapCurrencies = useCallback(() => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }, [fromCurrency, toCurrency, setFromCurrency, setToCurrency]);

  return (
    <Card className="w-full max-w-md mx-auto text-white">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Currency Converter
        </CardTitle>
        <CardDescription className="text-center">
          Convert between 200+ world currencies
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Amount Input */}
        <div className="space-y-2">
          <label htmlFor="amount">Amount</label>
          <Input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            defaultValue={amount}
            onChange={(e) => handleAmountChange(parseFloat(e.target.value))}
            placeholder="Enter amount"
          />
        </div>

        {/* Currency Selection */}
        <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2">
          <CurrencyInput
            label="From"
            value={fromCurrency}
            onChange={setFromCurrency}
            currencies={currencies}
          />
          <Button
            variant="ghost"
            size="icon"
            className="mt-8"
            onClick={handleSwapCurrencies}
            title="Swap currencies"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
          <CurrencyInput
            label="To"
            value={toCurrency}
            onChange={setToCurrency}
            currencies={currencies}
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* Conversion Result */}
        {convertedAmount !== null && (
          <div className="p-4 bg-muted rounded-md" aria-live="polite">
            <p className="text-sm text-muted-foreground">Result:</p>
            <p className="text-xl font-bold">
              {amount} {fromCurrency.toUpperCase()} ={" "}
              {convertedAmount.toFixed(4)} {toCurrency.toUpperCase()}
            </p>
          </div>
        )}
      </CardContent>

      {/* Convert Button */}
      <CardFooter>
        <Button className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Convert"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
