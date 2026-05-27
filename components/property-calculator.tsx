"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InputSlider } from "./input-slider";
import { ResultCard } from "./result-card";
import { SalaryComparison } from "./salary-comparison";
import { UpfrontBreakdown } from "./upfront-breakdown";
import { LoanBreakdownChart } from "./loan-breakdown-chart";
import {
  formatIndianCurrency,
  formatIndianCurrencyFull,
  calculateLoanAmount,
  calculateAffordableEmi,
  calculatePropertyValue,
  calculateDownPayment,
  calculateRegistrationCharges,
  calculateInteriorBuffer,
  calculateTotalUpfront,
  calculateTotalInterest,
} from "@/lib/calculations";
import { Home, IndianRupee, Wallet, PiggyBank, Building2, Calculator, Briefcase } from "lucide-react";

export function PropertyCalculator() {
  const [salary, setSalary] = useState(150000);
  const [tenure, setTenure] = useState(20);
  const [roi, setRoi] = useState(8.5);
  const [fundingPercentage, setFundingPercentage] = useState(80);
  const [selectedRule, setSelectedRule] = useState<50 | 55 | 60>(50);

  const calculations = useMemo(() => {
    // Calculate affordable EMI for each rule based on salary
    const emi50x = calculateAffordableEmi(salary, 50);
    const emi55x = calculateAffordableEmi(salary, 55);
    const emi60x = calculateAffordableEmi(salary, 60);

    // Calculate loan amounts for each rule
    const loan50x = calculateLoanAmount(emi50x, roi, tenure);
    const loan55x = calculateLoanAmount(emi55x, roi, tenure);
    const loan60x = calculateLoanAmount(emi60x, roi, tenure);

    // Calculate property values for each rule
    const property50x = calculatePropertyValue(loan50x, fundingPercentage);
    const property55x = calculatePropertyValue(loan55x, fundingPercentage);
    const property60x = calculatePropertyValue(loan60x, fundingPercentage);

    // Selected rule calculations
    const selectedEmi = selectedRule === 50 ? emi50x : selectedRule === 55 ? emi55x : emi60x;
    const loanAmount = selectedRule === 50 ? loan50x : selectedRule === 55 ? loan55x : loan60x;
    const propertyValue = selectedRule === 50 ? property50x : selectedRule === 55 ? property55x : property60x;

    const downPayment = calculateDownPayment(propertyValue, fundingPercentage);
    const registrationCharges = calculateRegistrationCharges(propertyValue, 7);
    const interiorBuffer = calculateInteriorBuffer(propertyValue, 8);
    const totalUpfront = calculateTotalUpfront(downPayment, registrationCharges, interiorBuffer);
    const totalInterest = calculateTotalInterest(selectedEmi, tenure, loanAmount);

    return {
      emi50x,
      emi55x,
      emi60x,
      loan50x,
      loan55x,
      loan60x,
      property50x,
      property55x,
      property60x,
      selectedEmi,
      loanAmount,
      propertyValue,
      downPayment,
      registrationCharges,
      interiorBuffer,
      totalUpfront,
      totalInterest,
    };
  }, [salary, tenure, roi, fundingPercentage, selectedRule]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Property Affordability Planner</h1>
              <p className="text-sm text-muted-foreground">For Indian Home Buyers</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Input Section */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-accent" />
              Your Financial Inputs
            </CardTitle>
            <CardDescription>
              Enter your monthly salary and loan preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-8 md:grid-cols-2">
            <div className="md:col-span-2">
              <InputSlider
                label="Monthly Salary (Net Take Home)"
                value={salary}
                onChange={setSalary}
                min={30000}
                max={1000000}
                step={10000}
                prefix="₹"
                formatDisplay={(v) => {
                  if (v >= 100000) return `${(v / 100000).toFixed(1)}L`;
                  return `${(v / 1000).toFixed(0)}K`;
                }}
                icon={<Briefcase className="w-4 h-4" />}
              />
            </div>
            <InputSlider
              label="Loan Tenure"
              value={tenure}
              onChange={setTenure}
              min={5}
              max={30}
              step={1}
              suffix=" years"
            />
            <InputSlider
              label="Interest Rate (ROI)"
              value={roi}
              onChange={setRoi}
              min={6}
              max={14}
              step={0.1}
              suffix="%"
              formatDisplay={(v) => v.toFixed(1)}
            />
            <InputSlider
              label="Loan Funding %"
              value={fundingPercentage}
              onChange={setFundingPercentage}
              min={60}
              max={90}
              step={5}
              suffix="%"
            />
          </CardContent>
        </Card>

        {/* Salary Multiples Section */}
        <Card className="bg-secondary/30 border-2 border-accent/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-accent" />
              Your Salary Multiples
            </CardTitle>
            <CardDescription>
              Based on {formatIndianCurrencyFull(salary)}/month salary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-card border border-border">
                <p className="text-xs text-muted-foreground mb-1">50x Salary</p>
                <p className="text-lg font-bold text-foreground">{formatIndianCurrency(salary * 50)}</p>
                <p className="text-xs text-muted-foreground mt-1">Annual: {formatIndianCurrency(salary * 12)}</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-card border border-border">
                <p className="text-xs text-muted-foreground mb-1">55x Salary</p>
                <p className="text-lg font-bold text-foreground">{formatIndianCurrency(salary * 55)}</p>
                <p className="text-xs text-muted-foreground mt-1">4.6 yrs income</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-card border border-border">
                <p className="text-xs text-muted-foreground mb-1">60x Salary</p>
                <p className="text-lg font-bold text-foreground">{formatIndianCurrency(salary * 60)}</p>
                <p className="text-xs text-muted-foreground mt-1">5 yrs income</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Salary Rule Selection & Results */}
        <div className="grid gap-6 lg:grid-cols-2">
          <SalaryComparison
            salary={salary}
            emi50x={calculations.emi50x}
            emi55x={calculations.emi55x}
            emi60x={calculations.emi60x}
            loan50x={calculations.loan50x}
            loan55x={calculations.loan55x}
            loan60x={calculations.loan60x}
            property50x={calculations.property50x}
            property55x={calculations.property55x}
            property60x={calculations.property60x}
            selectedRule={selectedRule}
            onSelectRule={setSelectedRule}
          />
          <LoanBreakdownChart
            loanAmount={calculations.loanAmount}
            totalInterest={calculations.totalInterest}
          />
        </div>

        {/* Selected Rule Banner */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm opacity-80">Selected: {selectedRule}% EMI-to-Income Rule</p>
                <p className="text-3xl font-bold">{formatIndianCurrencyFull(calculations.selectedEmi)}/month EMI</p>
              </div>
              <div className="flex flex-wrap gap-6 text-sm">
                <div>
                  <p className="opacity-80">Tenure</p>
                  <p className="font-semibold">{tenure} years ({tenure * 12} months)</p>
                </div>
                <div>
                  <p className="opacity-80">Interest Rate</p>
                  <p className="font-semibold">{roi}% p.a.</p>
                </div>
                <div>
                  <p className="opacity-80">Total Interest</p>
                  <p className="font-semibold">{formatIndianCurrency(calculations.totalInterest)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Results */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ResultCard
            title="Eligible Loan Amount"
            value={formatIndianCurrency(calculations.loanAmount)}
            description={formatIndianCurrencyFull(calculations.loanAmount)}
            icon={<IndianRupee className="w-4 h-4" />}
            variant="highlight"
          />
          <ResultCard
            title="Property You Can Afford"
            value={formatIndianCurrency(calculations.propertyValue)}
            description={`At ${fundingPercentage}% loan funding`}
            icon={<Building2 className="w-4 h-4" />}
            variant="accent"
          />
          <ResultCard
            title="Down Payment Required"
            value={formatIndianCurrency(calculations.downPayment)}
            description={`${100 - fundingPercentage}% of property value`}
            icon={<Wallet className="w-4 h-4" />}
          />
          <ResultCard
            title="Total Upfront Cash"
            value={formatIndianCurrency(calculations.totalUpfront)}
            description="Down payment + charges + buffer"
            icon={<PiggyBank className="w-4 h-4" />}
          />
        </div>

        {/* Upfront Breakdown */}
        <UpfrontBreakdown
          downPayment={calculations.downPayment}
          registrationCharges={calculations.registrationCharges}
          interiorBuffer={calculations.interiorBuffer}
          totalUpfront={calculations.totalUpfront}
        />

        {/* Info Section */}
        <Card className="bg-secondary/50 border-dashed">
          <CardContent className="py-6">
            <h3 className="font-semibold text-foreground mb-3">Understanding the Salary Rules</h3>
            <ul className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
              <li className="flex gap-2">
                <span className="text-accent font-bold">•</span>
                <span><strong>50% Rule:</strong> Banks prefer EMI to be max 50% of monthly salary - safest option</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">•</span>
                <span><strong>55% Rule:</strong> Commonly approved by banks for salaried individuals with good credit</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">•</span>
                <span><strong>60% Rule:</strong> Maximum stretch - approved for high earners with low other obligations</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">•</span>
                <span><strong>Loan Funding:</strong> Banks typically fund 75-90% of property value for salaried individuals</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="text-center py-6 text-sm text-muted-foreground border-t border-border">
          <p>This calculator provides estimates for planning purposes only.</p>
          <p>Actual loan eligibility depends on your credit score, employment, and bank policies.</p>
        </footer>
      </main>
    </div>
  );
}
