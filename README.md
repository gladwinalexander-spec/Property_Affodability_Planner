# Property Affordability Planner

A modern web application to help users calculate how much home they can afford based on their income, expenses, and financial goals.

## Features

- Calculate maximum affordable home price based on income and debt
- Adjust loan parameters (interest rate, term, down payment)
- Include additional costs like property tax, insurance, and HOA fees
- Visual debt-to-income ratio indicator
- Detailed monthly payment breakdown
- Responsive design for mobile and desktop

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18.17 or later

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/gladwinalexander-spec/Property_Affodability_Planner.git
   cd Property_Affodability_Planner
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── globals.css      # Global styles and design tokens
│   ├── layout.tsx       # Root layout with metadata
│   └── page.tsx         # Home page
├── components/
│   └── affordability-calculator.tsx  # Main calculator component
├── lib/
│   └── utils.ts         # Utility functions
├── package.json
├── tsconfig.json
├── next.config.ts
└── postcss.config.mjs
```

## How It Works

The calculator uses standard mortgage formulas to determine affordability:

1. **Maximum DTI Ratio**: Uses 43% as the standard maximum debt-to-income ratio
2. **Monthly Payment Calculation**: Includes principal, interest, taxes, insurance, and HOA
3. **Iterative Calculation**: Finds the maximum home price where total housing expenses fit within the DTI limit

## License

MIT
