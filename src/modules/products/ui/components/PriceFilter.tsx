"use client"
import React from "react";
import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PriceFilterProps {
  minPrice?: string | null;
  maxPrice?: string | null;
  onMinPriceChange?: (value: string) => void;
  onMaxPriceChange?: (value: string) => void;
}

export const formatAsCurrency = (value: string | number) => {
  value = value.toString();
  const numericValue = value.replace(/[^0-9.]/g, "");

  const parts = numericValue.split(".");
  const formattedValue =
   parts[0] + (parts.length > 1 ? "." + parts[1].slice(0, 2) : "")

  if (!formattedValue) return "";

  const numberValue = parseFloat(numericValue);
  if (isNaN(numberValue)) return "";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numberValue);
};

export default function PriceFilter({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
}: PriceFilterProps) {

  const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9.]/g, "");
    if(onMinPriceChange) onMinPriceChange(numericValue)
  }

  const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9.]/g, "");
    if(onMaxPriceChange) onMaxPriceChange(numericValue)
  }
 
  return <div className="flex flex-col gap-2">
    <div className="flex flex-col gap-2">
      <Label htmlFor="min-price" className="font-medium text-base">Minmum Price</Label>
      <Input
        id="min-price"
        type="text"
        placeholder='$0'
        value={minPrice ? formatAsCurrency(minPrice) : ""}
        onChange={handleMinPriceChange}
      />
    </div>
    <div className="flex flex-col gap-2">
      <Label htmlFor="max-price" className="font-medium text-base">Maximum Price</Label>
      <Input
        id="max-price"
        type="text"
        placeholder='$...'
        value={maxPrice ? formatAsCurrency(maxPrice) : ""}
        onChange={handleMaxPriceChange}
      />
    </div>
  </div>;
}
