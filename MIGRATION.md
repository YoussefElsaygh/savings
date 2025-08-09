# Migration Guide: Vanilla JS to Next.js

This document explains how the original vanilla JavaScript savings calculator was converted to a modern Next.js application.

## Architecture Changes

### Original Structure

```
savings/
├── app.js (Express server)
├── index.html (Main HTML file)
├── css/ (Stylesheets)
├── html/ (Tab content fragments)
└── js/ (JavaScript modules)
```

### New Next.js Structure

```
savings/
├── src/
│   ├── app/
│   │   └── page.tsx (Main page component)
│   ├── components/ (React components)
│   ├── hooks/ (Custom React hooks)
│   ├── lib/ (Utility functions)
│   └── types/ (TypeScript type definitions)
├── backup/ (Original files preserved)
└── package.json (Updated for Next.js)
```

## Key Transformations

### 1. HTML to React Components

- **Original**: Separate HTML files loaded dynamically
- **New**: React components with JSX

**Before (edit-tab.html)**:

```html
<div id="edit" class="tab-content active">
  <h2>Edit Your Savings</h2>
  <input type="number" id="usd-amount" />
</div>
```

**After (EditTab.tsx)**:

```tsx
export default function EditTab({ savings, setSavings }: EditTabProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Edit Your Savings</h2>
      <input
        type="number"
        value={savings.usdAmount || ""}
        onChange={(e) => handleInputChange("usdAmount", e.target.value)}
      />
    </div>
  );
}
```

### 2. CSS to Tailwind Classes

- **Original**: Custom CSS files with class-based styling
- **New**: Tailwind CSS utility classes

**Before (main.css)**:

```css
.tab {
  padding: 10px 20px;
  background-color: #e0e0e0;
  cursor: pointer;
}

.tab.active {
  background-color: #4caf50;
  color: white;
}
```

**After (Tailwind classes)**:

```tsx
<button
  className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
    activeTab === tab.id
      ? 'bg-green-500 text-white'
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
  }`}
>
```

### 3. jQuery to React State

- **Original**: jQuery DOM manipulation and event handling
- **New**: React state management and event handlers

**Before (jQuery)**:

```javascript
$("#save-btn").click(function () {
  localStorage.setItem("usdAmount", $("#usd-amount").val());
  $("#save-confirmation").show();
});
```

**After (React)**:

```tsx
const [savings, setSavings] = useState<SavingsData>(initialSavings);
const [showConfirmation, setShowConfirmation] = useState(false);

const handleSave = () => {
  setSavings(newSavings);
  setShowConfirmation(true);
};
```

### 4. localStorage Integration

- **Original**: Direct localStorage calls throughout the codebase
- **New**: Custom React hook for localStorage management

**Before**:

```javascript
localStorage.setItem("usdAmount", value);
const amount = localStorage.getItem("usdAmount");
```

**After**:

```tsx
const [savings, setSavings] = useLocalStorage<SavingsData>(
  "savings",
  initialSavings
);
```

### 5. Dynamic HTML Loading to Static Components

- **Original**: Fetch HTML fragments and inject into DOM
- **New**: Conditional rendering of React components

**Before**:

```javascript
function loadHTMLFragment(url, containerId) {
  return fetch(url)
    .then((response) => response.text())
    .then((html) => {
      document.getElementById(containerId).innerHTML = html;
    });
}
```

**After**:

```tsx
{
  activeTab === "edit" && <EditTab />;
}
{
  activeTab === "calculate" && <CalculateTab />;
}
```

## Benefits of the Migration

### 1. Type Safety

- Added TypeScript for better development experience
- Compile-time error checking
- Better IDE support with autocomplete

### 2. Modern React Features

- Hooks for state management
- Component composition
- Better performance with React's virtual DOM

### 3. Improved Developer Experience

- Hot reloading during development
- Better debugging tools
- Modern build pipeline with Turbopack

### 4. Responsive Design

- Tailwind CSS for consistent, responsive design
- Mobile-first approach
- Better accessibility

### 5. SEO and Performance

- Server-side rendering capabilities
- Optimized bundle sizes
- Better performance metrics

## Data Compatibility

The migration maintains full backward compatibility:

- All localStorage keys remain the same
- Data structures are preserved
- Users can continue using their existing data

## Deployment Differences

### Original Deployment

- Required Node.js server (Express)
- Served static files

### New Deployment Options

- **Static Export**: Can be deployed as static files
- **Vercel**: Optimized deployment platform
- **Traditional Hosting**: Still supports server deployment
- **CDN**: Can be served from CDN for better performance

## Migration Steps Taken

1. **Backup**: Preserved original files in `backup/` directory
2. **Setup**: Initialized Next.js project with TypeScript and Tailwind
3. **Types**: Created TypeScript interfaces for data structures
4. **Utils**: Converted utility functions to TypeScript
5. **Components**: Created React components for each tab
6. **Hooks**: Implemented custom localStorage hook
7. **Styling**: Migrated CSS to Tailwind classes
8. **Testing**: Verified functionality matches original app
9. **Documentation**: Updated README and created migration guide

## Future Enhancements

The Next.js architecture enables several future improvements:

- Server-side data persistence
- User authentication
- Real-time exchange rate APIs
- PWA capabilities
- Advanced analytics
- Multi-language support
