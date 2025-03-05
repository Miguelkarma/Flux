import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Currency {
  code: string;
  name: string;
}

interface Props {
  label: string;
  value: string;
  onChange: (val: string) => void;
  currencies?: Currency[];
  type?: "input" | "select";
}

export default function CurrencyInput({
  label,
  value = "",
  onChange,
  currencies = [],
  type = "select",
}: Props) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const selectedCurrency = currencies.find((c) => c.code === value);
  const filteredCurrencies = currencies.filter(
    ({ code, name }) =>
      code.toLowerCase().includes(search.toLowerCase()) ||
      name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-2 p-0 max-sm:w-24 text-center">
      <Label>{label}</Label>
      {type === "select" && currencies.length > 0 ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full max-sm:text-xs ">
              {selectedCurrency
                ? `${selectedCurrency.code.toUpperCase()} - ${
                    selectedCurrency.name
                  }`
                : "Select currency"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[400px]">
            <DialogHeader>
              <DialogTitle>Select a currency</DialogTitle>
            </DialogHeader>
            <Input
              type="text"
              placeholder="Search currency..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-2"
            />
            <ScrollArea className="max-h-[200px] overflow-y-hidden">
              <div className="grid gap-2">
                {filteredCurrencies.map(({ code, name }) => (
                  <Button
                    key={code}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      onChange(code);
                      setOpen(false);
                    }}
                  >
                    {code.toUpperCase()} - {name}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      ) : (
        <Input
          type="number"
          min="0"
          step="0.01"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter amount"
        />
      )}
    </div>
  );
}
