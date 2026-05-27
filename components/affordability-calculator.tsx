"use client";

import { useState, useMemo } from "react";
import {
  Home,
  DollarSign,
  Percent,
  Calculator,
  TrendingUp,
  PiggyBank,
  CreditCard,
  Building2,
} from "lucide-react";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

interface CalculatorInputs {
  annualIncome: number;
  monthlyDebt: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  propertyTax: number;
  homeInsurance: number;
  hoaFees: number;
}

interface AffordabilityResult {
  maxHomePrice: number;
  maxLoanAmount: number;
  monthlyPayment: number;
  monthlyPrincipalInterest: number;
  monthlyTaxes: number;
  monthlyInsurance: number;
  monthlyHOA: number;
  dtiRatio: number;
}

function calculateAffordability(inputs: CalculatorInputs): AffordabilityResult {
  const {
    annualIncome,
    monthlyDebt,
    downPayment,
    interestRate,
    loanTerm,
    propertyTax,
    homeInsurance,
    hoaFees,
  } = inputs;

  const monthlyIncome = annualIncome / 12;
  const maxDTI = 0.43; // Standard max DTI ratio
  const maxHousingExpense = monthlyIncome * maxDTI - monthlyDebt;

  // Monthly interest rate
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;

  // Estimate monthly taxes, insurance, and HOA as percentage of home price
  // We need to solve for home price where:
  // P&I + Taxes + Insurance + HOA = maxHousingExpense
  // This requires iteration since taxes/insurance depend on home price

  let homePrice = 0;
  let loanAmount = 0;
  let monthlyPI = 0;
  let monthlyTaxes = 0;
  let monthlyInsurance = 0;

  // Iterate to find max affordable home price
  for (let price = 50000; price <= 2000000; price += 1000) {
    const loan = price - downPayment;
    if (loan <= 0) continue;

    // Calculate P&I using mortgage formula
    const pi =
      monthlyRate === 0
        ? loan / numberOfPayments
        : (loan * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const taxes = (price * (propertyTax / 100)) / 12;
    const insurance = homeInsurance / 12;
    const totalMonthly = pi + taxes + insurance + hoaFees;

    if (totalMonthly <= maxHousingExpense) {
      homePrice = price;
      loanAmount = loan;
      monthlyPI = pi;
      monthlyTaxes = taxes;
      monthlyInsurance = insurance;
    } else {
      break;
    }
  }

  const totalMonthlyPayment = monthlyPI + monthlyTaxes + monthlyInsurance + hoaFees;
  const dtiRatio = ((totalMonthlyPayment + monthlyDebt) / monthlyIncome) * 100;

  return {
    maxHomePrice: homePrice,
    maxLoanAmount: loanAmount,
    monthlyPayment: totalMonthlyPayment,
    monthlyPrincipalInterest: monthlyPI,
    monthlyTaxes,
    monthlyInsurance,
    monthlyHOA: hoaFees,
    dtiRatio,
  };
}

function InputField({
  label,
  value,
  onChange,
  icon: Icon,
  prefix,
  suffix,
  min = 0,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon: React.ElementType;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className={cn(
            "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
            "transition-all duration-200",
            prefix && "pl-8",
            suffix && "pr-12"
          )}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function ResultCard({
  label,
  value,
  icon: Icon,
  variant = "default",
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  variant?: "default" | "primary" | "success";
}) {
  return (
    <div
      className={cn(
        "rounded-xl p-4 transition-all duration-200",
        variant === "primary" && "bg-primary/10 border border-primary/20",
        variant === "success" && "bg-success/10 border border-success/20",
        variant === "default" && "bg-card border border-border"
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "rounded-lg p-2",
            variant === "primary" && "bg-primary/20 text-primary",
            variant === "success" && "bg-success/20 text-success",
            variant === "default" && "bg-muted text-muted-foreground"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p
            className={cn(
              "text-xl font-semibold",
              variant === "primary" && "text-primary",
              variant === "success" && "text-success",
              variant === "default" && "text-foreground"
            )}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export function AffordabilityCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    annualIncome: 100000,
    monthlyDebt: 500,
    downPayment: 50000,
    interestRate: 6.5,
    loanTerm: 30,
    propertyTax: 1.2,
    homeInsurance: 1500,
    hoaFees: 200,
  });

  const results = useMemo(() => calculateAffordability(inputs), [inputs]);

  const updateInput = (key: keyof CalculatorInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 mb-4">
          <Home className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Property Affordability Planner
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Calculate how much home you can afford based on your financial situation
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-foreground">
              <Calculator className="h-5 w-5 text-primary" />
              Your Financial Details
            </h2>

            <div className="space-y-5">
              <InputField
                label="Annual Gross Income"
                value={inputs.annualIncome}
                onChange={(v) => updateInput("annualIncome", v)}
                icon={DollarSign}
                prefix="$"
                step={1000}
              />

              <InputField
                label="Monthly Debt Payments"
                value={inputs.monthlyDebt}
                onChange={(v) => updateInput("monthlyDebt", v)}
                icon={CreditCard}
                prefix="$"
                step={50}
              />

              <InputField
                label="Down Payment"
                value={inputs.downPayment}
                onChange={(v) => updateInput("downPayment", v)}
                icon={PiggyBank}
                prefix="$"
                step={5000}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-foreground">
              <TrendingUp className="h-5 w-5 text-primary" />
              Loan Details
            </h2>

            <div className="space-y-5">
              <InputField
                label="Interest Rate"
                value={inputs.interestRate}
                onChange={(v) => updateInput("interestRate", v)}
                icon={Percent}
                suffix="%"
                step={0.125}
                min={0}
                max={15}
              />

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Calculator className="h-4 w-4 text-muted-foreground" />
                  Loan Term
                </label>
                <div className="flex gap-2">
                  {[15, 20, 30].map((term) => (
                    <button
                      key={term}
                      onClick={() => updateInput("loanTerm", term)}
                      className={cn(
                        "flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200",
                        inputs.loanTerm === term
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input bg-background text-foreground hover:bg-muted"
                      )}
                    >
                      {term} years
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-foreground">
              <Building2 className="h-5 w-5 text-primary" />
              Additional Costs
            </h2>

            <div className="space-y-5">
              <InputField
                label="Property Tax Rate"
                value={inputs.propertyTax}
                onChange={(v) => updateInput("propertyTax", v)}
                icon={Percent}
                suffix="%"
                step={0.1}
                min={0}
                max={5}
              />

              <InputField
                label="Annual Home Insurance"
                value={inputs.homeInsurance}
                onChange={(v) => updateInput("homeInsurance", v)}
                icon={DollarSign}
                prefix="$"
                step={100}
              />

              <InputField
                label="Monthly HOA Fees"
                value={inputs.hoaFees}
                onChange={(v) => updateInput("hoaFees", v)}
                icon={DollarSign}
                prefix="$"
                step={25}
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-foreground">
              Your Affordability Results
            </h2>

            <div className="space-y-4">
              <ResultCard
                label="Maximum Home Price"
                value={formatCurrency(results.maxHomePrice)}
                icon={Home}
                variant="primary"
              />

              <ResultCard
                label="Maximum Loan Amount"
                value={formatCurrency(results.maxLoanAmount)}
                icon={DollarSign}
                variant="success"
              />

              <ResultCard
                label="Estimated Monthly Payment"
                value={formatCurrency(results.monthlyPayment)}
                icon={Calculator}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-foreground">
              Monthly Payment Breakdown
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Principal & Interest</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(results.monthlyPrincipalInterest)}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Property Taxes</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(results.monthlyTaxes)}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Home Insurance</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(results.monthlyInsurance)}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">HOA Fees</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(results.monthlyHOA)}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 bg-muted/50 rounded-lg px-3 -mx-3">
                <span className="font-semibold text-foreground">Total Monthly</span>
                <span className="font-bold text-primary text-lg">
                  {formatCurrency(results.monthlyPayment)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Debt-to-Income Ratio
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Your DTI Ratio</span>
                <span
                  className={cn(
                    "font-semibold",
                    results.dtiRatio <= 36
                      ? "text-success"
                      : results.dtiRatio <= 43
                        ? "text-warning"
                        : "text-destructive"
                  )}
                >
                  {formatPercent(results.dtiRatio)}
                </span>
              </div>

              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    results.dtiRatio <= 36
                      ? "bg-success"
                      : results.dtiRatio <= 43
                        ? "bg-warning"
                        : "bg-destructive"
                  )}
                  style={{ width: `${Math.min(results.dtiRatio, 100)}%` }}
                />
              </div>

              <p className="text-sm text-muted-foreground">
                {results.dtiRatio <= 36
                  ? "Excellent! Your DTI is in the ideal range for mortgage approval."
                  : results.dtiRatio <= 43
                    ? "Good. Your DTI is acceptable but consider reducing debt if possible."
                    : "High DTI. You may need to reduce debt or increase income for better rates."}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
            <p>
              <strong>Note:</strong> This calculator provides estimates based on
              standard lending criteria. Actual loan amounts and terms may vary
              based on your credit score, employment history, and lender
              requirements. Consult with a mortgage professional for personalized
              advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
