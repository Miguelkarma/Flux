"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, CircleDollarSign } from "lucide-react";
import { useCurrencyConverter } from "@/hooks/converterHook.tsx";
import CurrencyInput from "@/components/DashboardComponents/CurrencyInput";
import { useCallback } from "react";

export default function CurrencyConverter() {
  const {
    amount,
    fromCurrency,
    toCurrency,
    convertedAmount,
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
    <Card className="w-full max-w-md mx-auto bg-[hsl(var(--secondary))] text-popover-foreground border shadow  shadow-teal-200">
      <CardHeader className="space-y-1 text-center pb-2">
        <CardTitle className="text-2xl font-bold ">
          Currency Converter
        </CardTitle>
        <CardDescription className="text-slate-500">
          Convert between 200+ world currencies
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Amount Input */}
        <div className="space-y-2">
          <label
            htmlFor="amount"
            className="text-popover-foreground  text-sm font-medium"
          >
            Amount
          </label>
          <Input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="Enter amount"
            className="bg-card h-10"
            icon={CircleDollarSign}
          />
        </div>

        {/* Currency Selection */}
        <div className="flex flex-col space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">From</p>
            <CurrencyInput
              label=""
              value={fromCurrency}
              onChange={setFromCurrency}
              currencies={currencies}
            />
          </div>

          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSwapCurrencies}
              title="Swap currencies"
            >
              <ChevronsUpDown className="h-5 w-5" />
            </Button>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">To</p>
            <CurrencyInput
              label=""
              value={toCurrency}
              onChange={setToCurrency}
              currencies={currencies}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* Conversion Result */}
        {convertedAmount !== null && (
          <div
            className="p-4 bg-secondary border rounded-md text-center"
            aria-live="polite"
          >
            <p className="text-sm">Result:</p>
            <p className="text-xl font-bold">
              {amount} {fromCurrency.toUpperCase()} ={" "}
              {convertedAmount.toFixed(4)} {toCurrency.toUpperCase()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
