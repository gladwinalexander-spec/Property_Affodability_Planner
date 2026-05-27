"use client";

import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface InputSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  formatDisplay?: (value: number) => string;
  className?: string;
  icon?: ReactNode;
}

export function InputSlider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  prefix = "",
  suffix = "",
  formatDisplay,
  className,
  icon,
}: InputSliderProps) {
  const displayValue = formatDisplay ? formatDisplay(value) : value.toString();

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-foreground flex items-center gap-2">
          {icon}
          {label}
        </Label>
        <div className="flex items-center gap-1">
          {prefix && <span className="text-sm text-muted-foreground">{prefix}</span>}
          <Input
            type="number"
            value={value}
            onChange={(e) => {
              const newValue = parseFloat(e.target.value) || min;
              onChange(Math.min(Math.max(newValue, min), max));
            }}
            className="w-24 h-8 text-right text-sm font-semibold border-border bg-card"
            min={min}
            max={max}
            step={step}
          />
          {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{prefix}{formatDisplay ? formatDisplay(min) : min}{suffix}</span>
        <span>{prefix}{formatDisplay ? formatDisplay(max) : max}{suffix}</span>
      </div>
    </div>
  );
}
