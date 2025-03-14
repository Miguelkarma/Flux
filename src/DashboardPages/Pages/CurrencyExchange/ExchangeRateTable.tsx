import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchExchangeRates, ExchangeRate } from "@/api/currencyAPI";

export default function ExchangeRateTable() {
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadExchangeRates = async () => {
      try {
        setLoading(true);
        const rates = await fetchExchangeRates();
        setExchangeRates(rates);
      } catch (error) {
        console.error("Failed to fetch exchange rates:", error);
      } finally {
        setLoading(false);
      }
    };

    loadExchangeRates();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exchange Rates</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full overflow-x-auto">
          <div className="min-w-[px]">
            <ScrollArea className="h-64">
              <Table>
                <TableHeader className="sticky top-0 bg-card z-10">
                  <TableRow>
                    <TableHead>Currency</TableHead>
                    <TableHead>Exchange Rate (1 USD)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-center">
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center">
                        Loading exchange rates...
                      </TableCell>
                    </TableRow>
                  ) : exchangeRates.length > 0 ? (
                    exchangeRates.map(({ currency, rate }) => (
                      <TableRow key={currency}>
                        <TableCell>{currency}</TableCell>
                        <TableCell>{rate.toFixed(2)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center">
                        No exchange rates available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
