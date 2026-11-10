# Fitness & Finance Tracker - Next.js App

A comprehensive personal tracking application built with Next.js, TypeScript, Firebase, and Ant Design. Track your finances and calories all in one place!

## 🚀 Features

### 💰 Savings Tracker

- **Multi-Currency Support**: Track savings in USD and EGP
- **Precious Metals**: Support for 18K, 21K, and 24K gold (measured in grams)
- **Real-time Calculations**: Calculate total savings value based on current exchange rates and gold prices
- **Historical Tracking**: View calculation history and quantity changes over time

### 💳 Spending Tracker

- **Monthly Expense Tracking**: Log and categorize your expenses
- **Category Breakdown**: Visual analysis of spending by category
- **Budget Management**: Set and track monthly budgets
- **Firebase Integration**: Cloud-synced expense data

### 🍎 Calorie Tracker

- **Daily Calorie Logging**: Track food intake and exercise
- **Smart Calculator**: Science-based calorie goal calculator (Katch-McArdle & Mifflin-St Jeor formulas)
- **Weight Loss Journey**: Track your progress towards weight goals
- **Activity Tracking**: Log exercises with calorie burn
- **Food Database**: Pre-loaded with common foods and custom entries
- **Goal Management**: Set maintenance, deficit, or surplus targets

## 📱 Progressive Web App (PWA)

**Install as a mobile app!** This application is a fully-featured Progressive Web App with:

- **🏠 Installable**: Add to your phone's home screen for app-like experience
- **📴 Offline Support**: Works without internet after first load
- **🎯 Bottom Navigation**: Mobile-first navigation design for easy thumb access
- **📲 Push Ready**: Infrastructure ready for push notifications
- **🔔 App Shortcuts**: Quick access to Savings, Spending, and Calories sections
- **🎨 Native Feel**: Standalone mode with no browser UI, custom splash screen

Works seamlessly on desktop, tablet, and mobile devices with a modern, intuitive UI powered by Ant Design.

👉 **See [PWA_SETUP.md](./PWA_SETUP.md) for detailed installation and testing instructions**

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.4.6 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + Ant Design
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Google Sign-In)
- **State Management**: React hooks with Firebase integration
- **Build Tool**: Turbopack (for faster development)
- **PWA**: Service Worker, Web App Manifest, Offline Support

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm or yarn package manager
- Firebase account (for cloud features)

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

3. Set up Firebase:

   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Firestore Database and Authentication (Google provider)
   - Copy your Firebase config and add it to `src/lib/firebase.ts`
   - Deploy Firestore security rules from `firestore.rules`

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality

### Testing PWA Features

For the full PWA experience with service worker and install prompt:

1. Build the production version: `npm run build`
2. Start the production server: `npm run start`
3. Open https://localhost:3000 or deploy to a hosting service
4. On mobile: Look for "Add to Home Screen" or install prompt
5. Desktop: Look for install icon in browser address bar

## 📖 Usage

### Authentication

1. Sign in with Google to access all features
2. Your data is securely stored in Firebase and synced across devices

### 💰 Savings Module

1. **Calculate Tab**: Enter exchange rates and gold prices to calculate total value
2. **Edit Tab**: Update your savings quantities
3. **History Tabs**: View calculation and quantity history
4. **Gold Chart**: Visualize 21K gold price trends

### 💳 Spending Module

1. Click "Add Expense" to log purchases
2. Select category, enter amount and description
3. View monthly summaries and category breakdowns
4. Track spending patterns over time

### 🍎 Calorie Module

1. **Calculator**: Set up your personalized calorie goal
   - Enter age, height, weight, body fat %
   - Select activity level and goal (lose/maintain/gain)
   - Set target weight change and timeframe
2. **Today's Progress**: Log food and exercise throughout the day
3. **History**: View daily calorie logs and weight trends
4. **Quick Actions**: Fast-add common foods and exercises

## 💾 Data Storage

Data is stored using a hybrid approach:

- **Savings Module**: Browser localStorage (offline-first)
- **Spending Module**: Firebase Firestore (cloud-synced)
- **Calorie Module**: Firebase Firestore (cloud-synced)

All Firebase data is user-specific and secured with authentication rules.

## 📁 Project Structure

```
src/
├── app/                      # Next.js app router pages
│   ├── calories/            # Calorie tracker page
│   ├── savings/             # Savings calculator page
│   ├── spending/            # Spending tracker page
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── auth/                # Authentication components
│   ├── calories/            # Calorie tracking UI
│   ├── savings/             # Savings calculator UI
│   ├── spending/            # Spending tracker UI
│   └── shared/              # Shared components (Navbar, PWA, Modals)
├── constants/               # Static data
│   └── foods.ts             # Food database
├── hooks/                   # Custom React hooks
│   ├── useFirebaseData.ts   # Firebase data fetching
│   └── useLocalStorage.ts   # Local storage management
├── lib/                     # Utilities
│   ├── firebase.ts          # Firebase configuration
│   └── cache.ts             # Caching system
└── types/                   # TypeScript type definitions
    └── index.ts             # All app types
```

## 📊 Calculation Details

### Gold Price Calculations

The app automatically calculates different gold karat prices:

- **18K Gold**: Calculated as 21K price ÷ 1.1667 (75% purity)
- **21K Gold**: Direct input price (87.5% purity)
- **24K Gold**: Calculated as 21K price ÷ 0.875 (100% purity)

### Calorie Goal Formulas

The calorie calculator uses scientific formulas for accuracy:

**Katch-McArdle Formula** (when body fat % is known):

- BMR = 370 + (21.6 × Lean Body Mass in kg)
- Most accurate for individuals who know their body composition

**Mifflin-St Jeor Formula** (fallback):

- Men: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) + 5
- Women: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) - 161

Activity multipliers:

- Sedentary (little/no exercise): BMR × 1.2
- Lightly active (1-3 days/week): BMR × 1.375
- Moderately active (3-5 days/week): BMR × 1.55
- Very active (6-7 days/week): BMR × 1.725
- Extra active (physical job + exercise): BMR × 1.9

## 🔐 Firebase Security

The app uses Firestore security rules to protect user data:

- All data is user-scoped and accessible only by the authenticated user
- Rules are defined in `firestore.rules`
- Collections secured: `calorieGoals`, `dailyCalories`, `spending`

## ⚡ Performance Optimizations

- **Lazy Loading**: Components and data load on-demand
- **Firebase Indexing**: Optimized queries with compound indexes
- **Turbopack**: Fast development builds with hot module replacement

## 🎯 Roadmap

### Upcoming Features

- **Nutrition Features**:
  - Macros tracking (protein, carbs, fats)
  - Meal planning and prep
  - Barcode scanner for food logging
  - Recipe builder with macro calculations
- **Social Features**:
  - Community challenges and leaderboards
  - Follow other users' progress
- **Integration**:
  - Wearable device sync (Apple Health, Google Fit)
  - Export data to CSV/PDF
- **Mobile App**: React Native version for iOS and Android

## Browser Compatibility

### Desktop:

- Chrome (latest) ✅ - Full PWA support
- Firefox (latest) ✅ - Full PWA support
- Safari (latest) ✅ - Full PWA support
- Edge (latest) ✅ - Full PWA support

### Mobile:

- iOS Safari 11.3+ ✅ - Add to Home Screen, Standalone mode
- Chrome Android 73+ ✅ - Full PWA install, Service Worker
- Samsung Internet 8+ ✅ - Full PWA support
- Firefox Mobile ✅ - Full PWA support

## 🐛 Troubleshooting

### Common Issues

**Firebase Connection Errors:**

- Ensure Firebase config is correctly set in `src/lib/firebase.ts`
- Check that Firestore and Authentication are enabled in Firebase Console
- Verify security rules are deployed

**Data Not Syncing:**

- Sign in with Google to enable cloud sync
- Check internet connection
- Verify Firestore rules allow read/write access

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

---

**Built with ❤️ using Next.js, TypeScript, Firebase, and Ant Design**
