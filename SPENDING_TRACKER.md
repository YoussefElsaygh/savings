# 💰 Monthly Spending Tracker

## Overview

A comprehensive monthly spending tracker with category-based expense management, visualizations, and the same optimized caching system used across the app.

## ✨ Features

### 1. **Expense Tracking**

- Add expenses with amount, category, description, and date
- 8 predefined categories with icons and colors:
  - 🍔 Food & Dining
  - 🚗 Transportation
  - 🛍️ Shopping
  - 🎬 Entertainment
  - 💡 Bills & Utilities
  - 💊 Health & Fitness
  - 📚 Education
  - 📦 Other

### 2. **Monthly View**

- Select any month from the last 12 months
- View all expenses for selected month
- Quick statistics:
  - Total spent
  - Number of transactions
  - Average spending per day

### 3. **Visualizations**

- **Pie Chart**: Visual breakdown of spending by category
- **Category Breakdown**: Detailed list with progress bars and percentages
- **Recent Expenses**: Chronological list of all transactions

### 4. **Smart Caching**

- ✅ Uses the same optimized caching as Savings and Calories
- ✅ Instant loading from localStorage
- ✅ Zero Firestore calls when navigating between pages
- ✅ Background verification to keep data fresh
- ✅ Automatic cache invalidation on updates

## 🗂️ File Structure

```
src/
├── types/
│   └── index.ts                          # Added SpendingData types
├── hooks/
│   └── useFirebaseData.ts                # Added useSpendingDataFirebase hook
├── components/
│   └── spending/
│       ├── SpendingPage.tsx              # Main page component
│       ├── AddExpenseModal.tsx           # Modal to add expenses
│       ├── SpendingSummaryChart.tsx      # Pie chart visualization
│       ├── CategoryBreakdown.tsx         # Category list with percentages
│       └── MonthlySpendingSection.tsx    # Expense list
└── app/
    └── spending/
        ├── page.tsx                      # Route page
        └── layout.tsx                    # Layout with metadata
```

## 🎨 Components

### AddExpenseModal

- Form-based modal for adding expenses
- Amount input with currency prefix
- Category selector with icons
- Optional description field
- Date picker (can't select future dates)
- Validation and error handling

### SpendingSummaryChart

- Interactive pie chart using @ant-design/plots
- Shows spending distribution by category
- Color-coded by category
- Total amount in center
- Responsive legend

### CategoryBreakdown

- List view of all categories
- Progress bars showing percentage of total
- Color-coded tags with amounts
- Only shows categories with expenses

### MonthlySpendingSection

- Chronological list of expenses
- Delete functionality with confirmation
- Shows timestamp and description
- Category badges and icons

## 📊 Data Structure

### SpendingData

```typescript
{
  monthlyData: MonthlySpending[];  // Array of monthly data
}
```

**Note**: Categories are defined in `src/constants/categories.ts` and are NOT stored in Firestore. They are imported and used directly in the UI components.

### MonthlySpending

```typescript
{
  month: string;                    // "YYYY-MM"
  expenses: Expense[];              // All expenses for this month
  totalSpent: number;               // Total amount spent
  categoryTotals: {                 // Amount per category
    [categoryId]: number;
  };
}
```

### Expense

```typescript
{
  id: string;
  amount: number;
  category: string; // Category ID
  description: string;
  date: string; // "YYYY-MM-DD"
  timestamp: string; // ISO timestamp
}
```

## 🚀 Usage

### Navigation

- **Navbar**: Click "Spending" link (💰 Wallet icon)
- **Home Page**: Click the "Spending" card
- **Mobile**: Access via hamburger menu drawer

### Adding an Expense

1. Click "+ Add Expense" button
2. Enter amount (required)
3. Select category (required)
4. Add description (optional)
5. Choose date (required, defaults to today)
6. Click "Add Expense"

### Viewing Different Months

- Use the month selector dropdown in the top right
- Shows last 12 months
- Data automatically updates when month changes

### Deleting an Expense

- Click the delete (trash) icon on any expense
- Confirm deletion in the popup
- Expense is removed and totals recalculated

## 🔒 Security

### Firestore Rules

```javascript
match /spendingData/{document} {
  function getDocumentUserId() {
    return document.split('_')[0];
  }

  allow read: if isAuthenticated() && isOwner(getDocumentUserId());
  allow write: if isAuthenticated() && isOwner(getDocumentUserId());
}
```

- Users can only access their own spending data
- Document ID format: `{userId}_spending`
- Authentication required for all operations

## ⚡ Performance

### Caching Benefits

- **First Load**: 1 Firestore read (fetches all spending data)
- **Subsequent Loads**: 0 Firestore reads (uses cache)
- **Month Changes**: 0 Firestore reads (all months cached)
- **Add/Delete Expense**: 1 Firestore write

### Expected Usage

| Action                 | Firestore Operations |
| ---------------------- | -------------------- |
| Navigate to Spending   | 0 reads (cached)     |
| Change month           | 0 reads (cached)     |
| Add expense            | 1 write              |
| Delete expense         | 1 write              |
| Navigate away and back | 0 reads (cached)     |

## 🎯 Key Features

### Responsive Design

- ✅ Mobile-friendly layout
- ✅ Grid adapts to screen size
- ✅ Charts scale appropriately
- ✅ Touch-friendly interactions

### User Experience

- ✅ Instant loading (cached data)
- ✅ Optimistic updates (UI updates immediately)
- ✅ Confirmation dialogs for destructive actions
- ✅ Loading states and error handling
- ✅ Empty states with helpful messages

### Data Management

- ✅ Automatic calculation of totals
- ✅ Category aggregation
- ✅ Month-based organization
- ✅ Persistent across devices (Firestore)
- ✅ Fast local access (localStorage)

## 🔄 Integration

### Navbar

- Added "Spending" link with wallet icon
- Shows in both desktop and mobile views
- Only visible when user is authenticated
- Active state when on spending page

### Home Page

- Added spending card alongside Savings and Calories
- 3-column layout (was 2-column)
- Wallet list icon
- Descriptive text about features

### Firebase Hook

- Uses same `useFirebaseData` hook pattern
- Registry key: `spendingData`
- Collection: `spendingData`
- Document ID: `{userId}_spending`

## 📈 Future Enhancements

Potential improvements:

1. Budget limits per category
2. Recurring expenses
3. Export data to CSV
4. Year-over-year comparisons
5. Spending trends over time
6. Custom categories
7. Receipt photo uploads
8. Multi-currency support
9. Spending predictions
10. Email reports

## 🐛 Troubleshooting

### Data Not Loading

- Check authentication status
- Verify Firestore rules are deployed
- Clear cache and reload: `localStorage.clear()`

### Chart Not Showing

- Verify you have expenses for selected month
- Check browser console for errors
- Ensure @ant-design/plots is installed

### Changes Not Saving

- Check network connection
- Verify user is authenticated
- Check Firestore console for errors

## 📝 Notes

- All dates are in YYYY-MM-DD format
- Months are in YYYY-MM format
- Timestamps are ISO 8601 format
- Amounts are stored as numbers (not strings)
- Category colors are predefined and cannot be changed (yet)
- Maximum description length: 200 characters

## ✅ Deployment Checklist

- [x] Types defined in types/index.ts
- [x] Firebase hook created with caching
- [x] All components created and styled
- [x] Route configured at /spending
- [x] Navbar updated with link
- [x] Home page updated with card
- [x] Firestore rules updated
- [x] Responsive design tested
- [x] Caching optimizations applied
- [x] Linter errors fixed

The spending tracker is now fully integrated and ready to use! 🎉
