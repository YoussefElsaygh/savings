# Savings Calculator - Next.js App

A modern, responsive savings calculator built with Next.js, TypeScript, and Tailwind CSS. Track your savings across multiple currencies and precious metals with historical data and calculations.

## Features

- **Multi-Currency Support**: Track savings in USD and EGP
- **Precious Metals**: Support for 18K, 21K, and 24K gold (measured in grams)
- **Real-time Calculations**: Calculate total savings value based on current exchange rates and gold prices
- **Historical Tracking**:
  - View calculation history with rate comparisons
  - Track savings quantity changes over time
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Local Storage**: All data is stored locally in your browser

## Tech Stack

- **Frontend**: Next.js 15.4.6 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React hooks with localStorage
- **Build Tool**: Turbopack (for faster development)

## Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd savings
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality

## Usage

### 1. Savings Quantity Tab

- Enter your savings amounts for different currencies and gold types
- Click "Save Amounts" to store your data
- Data is automatically saved to browser localStorage

### 2. Savings Calculator Tab

- Enter current exchange rates (USD to EGP)
- Enter current gold prices (21K gold price per gram)
- Click "Calculate Total Savings" to see your total wealth
- Previous calculations are shown for quick reference

### 3. Savings Quantity History Tab

- View all your previously saved savings amounts
- See timestamps for when each entry was made
- Track how your savings quantities have changed over time

### 4. History Tab

- View detailed calculation history
- See rate changes and their impact on your total savings
- Visual indicators show whether your savings value increased or decreased

## Data Storage

All data is stored locally in your browser using localStorage:

- **Savings data**: Current amounts for each currency/gold type
- **Rate history**: Last 5 calculation entries with rates and totals
- **Quantity history**: Up to 50 entries of savings amount changes

## Gold Price Calculations

The app automatically calculates different gold karat prices:

- **18K Gold**: Calculated as 21K price ÷ 1.1667 (75% purity)
- **21K Gold**: Direct input price (87.5% purity)
- **24K Gold**: Calculated as 21K price ÷ 0.875 (100% purity)

## Migration from Original App

This Next.js version maintains full compatibility with the original vanilla JavaScript application:

- All functionality has been preserved
- Data structure remains the same
- User interface has been modernized with Tailwind CSS
- Added TypeScript for better development experience

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Backup

The original vanilla JavaScript version has been preserved in the `backup/` directory for reference.
