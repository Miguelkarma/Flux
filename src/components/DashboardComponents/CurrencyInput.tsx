import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Banknote } from "lucide-react";

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
    <div className="space-y-2 w-full text-foreground ">
      <Label className="block text-center">{label}</Label>
      {type === "select" && currencies.length > 0 ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-10 px-3 flex items-center justify-center"
            >
              <span
                className="truncate text-sm"
                data-testid="selected-currency-display"
              >
                {selectedCurrency
                  ? `${selectedCurrency.code.toUpperCase()} - ${
                      selectedCurrency.name
                    }`
                  : "Select currency"}
              </span>
            </Button>
          </DialogTrigger>
          <DialogDescription></DialogDescription>
          <DialogContent className="max-h-[400px] text-foreground">
            <DialogHeader>
              <DialogTitle>Select a currency</DialogTitle>
            </DialogHeader>
            <Input
              type="text"
              placeholder="Search currency..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={Banknote}
            />
            <ScrollArea className="max-h-[200px]">
              <div className="grid gap-2">
                {filteredCurrencies.map(({ code, name }) => (
                  <Button
                    key={code}
                    variant="ghost"
                    className="w-full justify-start  hover:bg-card"
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
