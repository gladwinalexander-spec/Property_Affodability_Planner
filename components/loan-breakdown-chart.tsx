"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatIndianCurrency } from "@/lib/calculations";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface LoanBreakdownChartProps {
  loanAmount: number;
  totalInterest: number;
}

export function LoanBreakdownChart({ loanAmount, totalInterest }: LoanBreakdownChartProps) {
  const data = [
    { name: "Principal", value: loanAmount, fill: "var(--color-primary)" },
    { name: "Interest", value: totalInterest, fill: "var(--color-chart-1)" },
  ];

  const totalPayable = loanAmount + totalInterest;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Loan Payment Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatIndianCurrency(value)}
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                }}
              />
              <Legend
                formatter={(value: string) => (
                  <span className="text-sm text-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2 text-center">
          <p className="text-sm text-muted-foreground">Total Amount Payable</p>
          <p className="text-2xl font-bold text-foreground">{formatIndianCurrency(totalPayable)}</p>
          <p className="text-xs text-muted-foreground">
            Interest: {((totalInterest / loanAmount) * 100).toFixed(1)}% of principal
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
