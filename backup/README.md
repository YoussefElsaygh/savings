# Savings Calculator

A comprehensive web application for tracking and calculating the total value of your savings portfolio including USD, EGP, and various gold types (18K, 21K, 24K).

## Features

### 💰 Multi-Currency & Asset Support

- **USD**: Track US Dollar amounts with real-time exchange rates
- **EGP**: Egyptian Pound savings
- **Gold Portfolio**: Support for 18K, 21K, and 24K gold in grams

### 📊 Smart Calculations

- Real-time total portfolio value calculation
- Automatic gold rate calculations (18K and 24K derived from 21K rates)
- Historical rate tracking and reuse
- Savings comparison with trend indicators

### 📈 Advanced History Tracking

- **Calculation History**: Complete record of all calculations with monthly grouping
- **Quantity History**: Track changes in your savings amounts over time
- **Collapsible Sections**: Organized by month and saving type for easy navigation
- **Smart Filtering**: Only shows entries with actual changes

### 🎯 Intelligent User Experience

- **Smart Tab Selection**: Automatically opens relevant tab based on your data
  - New users → "Savings Quantity" tab
  - Existing users → "Savings Calculator" tab
- **Rate Reuse**: Quick access to your last 5 rate entries
- **Persistent Storage**: All data saved locally in your browser

## Getting Started

### Prerequisites

- Node.js (for running the local server)
- Modern web browser with localStorage support

### Installation

1. **Clone or download the project**

   ```bash
   git clone <repository-url>
   cd savings
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the application**

   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:5500`

## Usage Guide

### First Time Setup

1. **Enter Your Savings** (Savings Quantity tab)

   - Add your USD amount
   - Add your EGP amount
   - Add your gold amounts in grams (18K, 21K, 24K)
   - Click "Save Amounts"

2. **Calculate Portfolio Value** (Savings Calculator tab)
   - Enter current USD exchange rate
   - Enter current 21K gold price per gram
   - Click "Calculate Total Savings"
   - View your complete portfolio breakdown

### Ongoing Use

- **Update Quantities**: Modify amounts in the Savings Quantity tab
- **Regular Calculations**: Use current rates in the Savings Calculator
- **Review History**: Check past calculations in the History tab
- **Track Changes**: Monitor quantity changes in the Savings Quantity History tab

## Project Structure

```
savings/
├── css/
│   ├── main.css              # Main application styles
│   ├── quantity-history.css  # Quantity history specific styles
│   └── history.css           # History tab specific styles
├── html/
│   ├── edit-tab.html         # Savings quantity tab content
│   ├── calculate-tab.html    # Calculator tab content
│   ├── history-tab.html      # History tab content
│   └── quantity-history-tab.html # Quantity history tab content
├── js/
│   ├── utils.js              # Shared utility functions
│   ├── editTab.js            # Savings quantity functionality
│   ├── calculateTab.js       # Calculator functionality
│   ├── historyTab.js         # History functionality
│   ├── quantityHistoryTab.js # Quantity history functionality
│   ├── htmlLoader.js         # Dynamic HTML loading
│   └── main.js               # Main app coordination
├── index.html                # Main application file
├── app.js                    # Express server
└── package.json              # Dependencies and scripts
```

## Technical Details

### Architecture

- **Modular Design**: Each feature separated into its own files
- **Dynamic Loading**: HTML fragments loaded asynchronously
- **Event-Driven**: jQuery-based event handling
- **Local Storage**: Browser-based data persistence

### Gold Rate Calculations

- **21K Gold**: Direct input (base rate)
- **24K Gold**: Calculated as `21K rate / 0.875`
- **18K Gold**: Calculated as `21K rate / 1.1667`

### Data Storage

All data is stored locally in your browser using localStorage:

- Savings amounts
- Calculation history
- Rate history

## Features in Detail

### Savings Quantity Tab

- Input fields for all asset types
- Real-time saving to localStorage
- Validation and formatting
- Success confirmation

### Savings Calculator Tab

- Current rate inputs
- Last 5 rates quick access
- Complete portfolio breakdown
- Trend indicators (↑ ↓ →)

### History Tab

- Monthly grouping with collapsible sections
- Complete calculation records
- Delete individual entries
- Clear all history option

### Savings Quantity History Tab

- Grouped by asset type with collapsible sections
- Shows only actual changes
- Latest to oldest chronological order
- Visual change indicators (green/red/orange)

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Data Privacy

- **Local Storage Only**: All data stays in your browser
- **No Server Storage**: No data sent to external servers
- **No Tracking**: No analytics or tracking implemented
- **Offline Capable**: Works without internet after initial load

## Development

### Adding New Features

1. **CSS**: Add styles to appropriate CSS file in `/css/`
2. **HTML**: Create/modify HTML fragments in `/html/`
3. **JavaScript**: Add functionality in `/js/`
4. **Integration**: Update `main.js` and `htmlLoader.js` as needed

### Customization

- **Styling**: Modify CSS files for visual changes
- **Calculations**: Update formulas in `utils.js`
- **Layout**: Modify HTML fragments
- **Behavior**: Adjust JavaScript modules

## Troubleshooting

### Common Issues

**Tab content not loading**

- Check browser console for errors
- Ensure all HTML fragments exist
- Verify server is running

**Data not persisting**

- Check if localStorage is enabled
- Clear browser cache if needed
- Ensure you're clicking "Save Amounts"

**Calculations incorrect**

- Verify rate inputs are numeric
- Check gold calculation formulas in `utils.js`
- Ensure amounts are saved before calculating

## License

This project is open source and available under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues, questions, or feature requests, please open an issue in the repository.

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Author**: Savings Calculator Team
