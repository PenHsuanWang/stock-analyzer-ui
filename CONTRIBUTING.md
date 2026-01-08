# Contributing to Stock Analysis Portal UI

Welcome to the team! We are excited to have you contribute. This document fills in the gaps between the high-level architecture (in `README.md`) and the day-to-day coding tasks.

## 1. Environment Setup

### Backend Dependencies
This frontend is useless without its backend counterparts. You must have the following services running locally before starting the UI:

1.  **Stock Data Service** (Port `8001`): Handles data fetching, database operations, and job scheduling.
2.  **ML System** (Port `8000`): Handles model training and inference.

*If you do not have access to these repositories, please contact the engineering lead immediately.*

### Environment Variables
Check `.env.example` for the list of required variables. Ensure your `.env` file points to the correct local ports for the backend services.

```env
REACT_APP_BACKEND_URL_STOCK_DATA=http://localhost:8001
REACT_APP_BACKEND_URL_ML_SYSTEM=http://localhost:8000
```

## 2. Data Models & Contracts

Our application relies heavily on specific data structures from the backend. Since we are not using TypeScript yet, please adhere strictly to these shapes when handling data.

### The `StockData` Object
When visualizing data in `StockAnalysisDashboard` or `IntegratedTechnicalAnalysisChart`, we expect an array of objects with this structure:

```javascript
{
  "Date": "2023-01-01",      // ISO Date String (YYYY-MM-DD)
  "Open": 150.0,             // Number
  "High": 155.0,             // Number
  "Low": 149.0,              // Number
  "Close": 152.0,            // Number
  "Volume": 1000000,         // Number
  "Pattern": "Doji",         // String (Optional) - Name of detected pattern
  "MACD": 0.5,               // Number (Optional)
  "Signal_Line": 0.4,        // Number (Optional)
  "RSI": 65.0,               // Number (Optional)
  "MA_50": 145.0             // Number (Optional) - Dynamic keys for Moving Averages
}
```

## 3. Styling Guidelines

We follow a **Modular CSS** approach to keep styles scoped and maintainable.

*   **Do:** Create a `.css` file in `src/styles/` that matches your component name (e.g., `MyComponent.js` -> `src/styles/MyComponent.css`).
*   **Do:** Use meaningful class names.
*   **Avoid:** Inline styles (e.g., `<div style={{ margin: '10px' }}>`). *Note: You may see some inline styles in older chart components; consider these technical debt to be refactored.*
*   **Avoid:** Modifying `App.css` or `index.css` unless for global theme changes.

## 4. Testing Strategy

We use `jest` and `react-testing-library`.

### Mocking the API
Do not make real network calls in tests. Our API layer (`src/services/api.js`) should be mocked.

**Example:**
```javascript
import { render, screen } from '@testing-library/react';
import { useStockDataFetcher } from '../hooks/useStockDataFetcher';

// Mock the hook
jest.mock('../hooks/useStockDataFetcher');

test('displays loading state', () => {
  useStockDataFetcher.mockReturnValue({
    isLoading: true,
    data: null
  });
  
  // Render your component...
});
```

### Canvas & Chart Mocks
We have global mocks set up in `src/setupTests.js` for:
*   `react-plotly.js`
*   `HTMLCanvasElement` (Chart.js dependency)

If your test fails due to canvas errors, ensure you are not trying to inspect the internal render output of the charting libraries, as they are mocked to return `null` or empty implementations.

## 5. Directory Structure for New Features

When adding a new feature (e.g., "Portfolio Tracker"):
1.  **Page:** Create `src/pages/PortfolioPage.js`.
2.  **Components:** Create `src/components/portfolio/` folder for feature-specific widgets.
3.  **Styles:** Create `src/styles/PortfolioPage.css`.
4.  **Route:** Register the new route in `App.js` (inside `src/views/` or root).

Happy Coding!
