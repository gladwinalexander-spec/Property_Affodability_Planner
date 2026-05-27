"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatIndianCurrency, formatIndianCurrencyFull } from "@/lib/calculations";
import { Check } from "lucide-react";

interface SalaryComparisonProps {
  salary: number;
  emi50x: number;
  emi55x: number;
  emi60x: number;
  loan50x: number;
  loan55x: number;
  loan60x: number;
  property50x: number;
  property55x: number;
  property60x: number;
  selectedRule: 50 | 55 | 60;
  onSelectRule: (rule: 50 | 55 | 60) => void;
}

export function SalaryComparison({
  salary,
  emi50x,
  emi55x,
  emi60x,
  loan50x,
  loan55x,
  loan60x,
  property50x,
  property55x,
  property60x,
  selectedRule,
  onSelectRule,
}: SalaryComparisonProps) {
  const maxEmi = emi60x;

  const salaryRules = [
    {
      rule: 50 as const,
      label: "50% Rule",
      emi: emi50x,
      loan: loan50x,
      property: property50x,
      description: "Conservative - Recommended by banks",
      color: "bg-chart-3",
      borderColor: "border-chart-3",
      width: (emi50x / maxEmi) * 100,
    },
    {
      rule: 55 as const,
      label: "55% Rule",
      emi: emi55x,
      loan: loan55x,
      property: property55x,
      description: "Moderate - Commonly approved",
      color: "bg-chart-1",
      borderColor: "border-chart-1",
      width: (emi55x / maxEmi) * 100,
    },
    {
      rule: 60 as const,
      label: "60% Rule",
      emi: emi60x,
      loan: loan60x,
      property: property60x,
      description: "Aggressive - Maximum stretch",
      color: "bg-chart-5",
      borderColor: "border-chart-5",
      width: 100,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Affordability by Salary Rule</CardTitle>
        <CardDescription>
          Based on your salary of <span className="font-semibold text-foreground">{formatIndianCurrencyFull(salary)}</span>/month
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {salaryRules.map((item) => (
          <button
            key={item.rule}
            onClick={() => onSelectRule(item.rule)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
              selectedRule === item.rule
                ? `${item.borderColor} bg-secondary/50`
                : "border-border hover:border-muted-foreground/30 hover:bg-secondary/30"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-foreground">{item.label}</p>
                  {selectedRule === item.rule && (
                    <span className={`p-0.5 rounded-full ${item.color}`}>
                      <Check className="w-3 h-3 text-white" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-3">{item.description}</p>
                
                {/* Progress bar */}
                <div className="h-2 bg-secondary rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.width}%` }}
                  />
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Max EMI</p>
                    <p className="font-semibold text-foreground">{formatIndianCurrency(item.emi)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Loan</p>
                    <p className="font-semibold text-foreground">{formatIndianCurrency(item.loan)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Property</p>
                    <p className="font-semibold text-foreground">{formatIndianCurrency(item.property)}</p>
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
        
        <p className="text-xs text-muted-foreground text-center pt-2">
          Click a rule to see detailed calculations below
        </p>
      </CardContent>
    </Card>
  );
}
