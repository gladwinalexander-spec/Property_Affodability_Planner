"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatIndianCurrency } from "@/lib/calculations";

interface UpfrontBreakdownProps {
  downPayment: number;
  registrationCharges: number;
  interiorBuffer: number;
  totalUpfront: number;
}

export function UpfrontBreakdown({
  downPayment,
  registrationCharges,
  interiorBuffer,
  totalUpfront,
}: UpfrontBreakdownProps) {
  const items = [
    {
      label: "Down Payment",
      value: downPayment,
      percentage: (downPayment / totalUpfront) * 100,
      color: "bg-primary",
    },
    {
      label: "Registration & Stamp Duty",
      value: registrationCharges,
      percentage: (registrationCharges / totalUpfront) * 100,
      color: "bg-chart-1",
    },
    {
      label: "Interior & Moving Buffer",
      value: interiorBuffer,
      percentage: (interiorBuffer / totalUpfront) * 100,
      color: "bg-chart-3",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upfront Cash Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stacked Bar */}
        <div className="h-8 flex rounded-lg overflow-hidden">
          {items.map((item, index) => (
            <div
              key={item.label}
              className={`${item.color} transition-all duration-500 flex items-center justify-center`}
              style={{ width: `${item.percentage}%` }}
            >
              {item.percentage > 15 && (
                <span className="text-xs font-medium text-white truncate px-1">
                  {item.percentage.toFixed(0)}%
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-sm text-muted-foreground">{item.label}</span>
              </div>
              <span className="font-semibold">{formatIndianCurrency(item.value)}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground">Total Upfront Cash Required</span>
            <span className="text-xl font-bold text-accent">{formatIndianCurrency(totalUpfront)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
