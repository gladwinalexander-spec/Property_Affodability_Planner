// Indian currency formatting utilities
export function formatIndianCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatIndianCurrencyFull(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

// EMI formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
// Where P = Principal, r = monthly interest rate, n = tenure in months
export function calculateLoanAmount(emi: number, annualRate: number, tenureYears: number): number {
  const monthlyRate = annualRate / 12 / 100;
  const tenureMonths = tenureYears * 12;
  
  if (monthlyRate === 0) return emi * tenureMonths;
  
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const loanAmount = emi * ((factor - 1) / (monthlyRate * factor));
  
  return Math.round(loanAmount);
}

// Calculate required salary based on EMI multiplier rules
// 50x rule: EMI should not exceed 50% of monthly salary (conservative)
// 55x rule: EMI should not exceed 45% of monthly salary (moderate)
// 60x rule: EMI should not exceed 40% of monthly salary (aggressive)
export function calculateRequiredSalary(emi: number, multiplier: number): number {
  // multiplier represents EMI as a percentage of salary
  // 50x means salary should be at least 2x EMI (EMI = 50% of salary)
  // 55x means salary should be at least 1.82x EMI (EMI = 55% of salary) - banks allow this
  // 60x means salary should be at least 1.67x EMI (EMI = 60% of salary) - stretching
  return Math.round(emi * (100 / multiplier));
}

// Calculate affordable EMI based on salary and multiplier rule
// 50x rule: Affordable EMI = salary * 50% (conservative - banks prefer this)
// 55x rule: Affordable EMI = salary * 55% (moderate)
// 60x rule: Affordable EMI = salary * 60% (aggressive - max banks may allow)
export function calculateAffordableEmi(salary: number, multiplier: number): number {
  return Math.round(salary * (multiplier / 100));
}

// Calculate property value from loan amount and funding percentage
export function calculatePropertyValue(loanAmount: number, fundingPercentage: number): number {
  return Math.round(loanAmount / (fundingPercentage / 100));
}

// Calculate down payment
export function calculateDownPayment(propertyValue: number, fundingPercentage: number): number {
  return Math.round(propertyValue * (1 - fundingPercentage / 100));
}

// Registration charges (typically 5-7% of property value in most Indian states)
export function calculateRegistrationCharges(propertyValue: number, percentage: number = 7): number {
  return Math.round(propertyValue * (percentage / 100));
}

// Interior and moving buffer (typically 5-10% of property value)
export function calculateInteriorBuffer(propertyValue: number, percentage: number = 8): number {
  return Math.round(propertyValue * (percentage / 100));
}

// Total upfront cash required
export function calculateTotalUpfront(
  downPayment: number,
  registrationCharges: number,
  interiorBuffer: number
): number {
  return downPayment + registrationCharges + interiorBuffer;
}

// Calculate total interest paid
export function calculateTotalInterest(emi: number, tenureYears: number, loanAmount: number): number {
  const totalPaid = emi * tenureYears * 12;
  return totalPaid - loanAmount;
}
