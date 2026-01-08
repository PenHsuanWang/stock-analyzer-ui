# Stock Analysis Portal - Frontend UI

## Project Overview

This web application is the frontend user interface for a comprehensive Stock Analysis Service. It provides tools for collecting, analyzing, and visualizing stock market data. Users can select stocks, specify date ranges, train machine learning models, schedule automatic data fetching jobs, and visualize complex financial data through interactive charts (Candlestick, Heatmap, MACD, RSI).

## Key Features

### 1. Unified Stock Analysis Dashboard
**Location:** `/stock-analysis-dashboard`
The central hub for technical analysis, combining:
- **Candlestick Charts**: Interactive price charts with zoom and pan.
- **Pattern Recognition**: Automatic detection of candlestick patterns (e.g., Doji, Hammer) with filtering capabilities.
- **Technical Indicators**: Toggleable MACD, RSI, Moving Averages, and Volume charts.
- **Multi-Asset Support**: Compare multiple stocks side-by-side.

### 2. Job Scheduler (New!)
**Location:** `/job-scheduler`
- **Automated Fetching**: Schedule recurring jobs to fetch stock data (e.g., "Fetch AAPL every day at 18:00").
- **Execution History**: View detailed logs of past job runs, including success/failure status and specific error messages.
- **Management**: Create, edit, pause, or delete scheduled jobs.

### 3. Data Collection & Management
**Location:** `/data-collect`
- **Search & Fetch**: Interface to query the backend for raw stock data.
- **Data Preview**: Instant candlestick preview of fetched data.
- **Management**: Save interesting datasets to the database for future analysis or delete obsolete ones.

### 4. Machine Learning Integration
- **Model Management** (`/model-manage`): View and manage trained ML models.
- **Training Setup** (`/model-training-setup`): Configure and initiate new model training sessions.
- **Trainer Control** (`/trainer-control`): Monitor active training processes and view real-time metrics.
- **Model Comparison** (`/model-comparison`): Compare performance metrics across different models.

---

## Technical Stack

- **Framework**: React 18 (Create React App)
- **UI Library**: Material UI (MUI) v5
- **Charting**: 
  - `plotly.js` / `react-plotly.js` (Primary for complex financial charts)
  - `chart.js` / `react-chartjs-2` (Secondary visualizations)
- **State Management**: React Hooks (`useState`, `useEffect`, `useCallback`)
- **Routing**: `react-router-dom` v6
- **HTTP Client**: `axios`
- **Date Handling**: `date-fns`

---

## Installation & Usage

### Prerequisites
- Node.js (v14+)
- NPM or Yarn
- **Backend Services**: This frontend relies on two distinct microservices:
  1.  **Stock Data Service** (Default: `http://localhost:8001`) - Handles data fetching, storage, and scheduling.
  2.  **ML System** (Default: `http://localhost:8000`) - Handles model training, inference, and management.
  *Ensure these services are running locally or are accessible via the network.*

### Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configuration**
   Create a `.env` file in the root directory (optional, defaults provided in `src/services/api.js`):
   ```env
   REACT_APP_BACKEND_URL_STOCK_DATA=http://localhost:8001
   REACT_APP_BACKEND_URL_ML_SYSTEM=http://localhost:8000
   REACT_APP_API_TIMEOUT=30000
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```
   The application will open at `http://localhost:3000`.

---

## Development Guidelines

**New Developer?** Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guides on setup, data models, and testing.

### AI-Assisted Development with GitHub Copilot

This project includes custom instructions for GitHub Copilot Chat that automatically enforce our coding standards, architecture patterns, and quality requirements.

**Quick Setup:**
1. Install [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) and [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) extensions in VS Code
2. The custom instructions in `.github/copilot-instructions.md` will load automatically
3. See [.github/COPILOT_SETUP_GUIDE.md](./.github/COPILOT_SETUP_GUIDE.md) for detailed setup
4. Use [.github/COPILOT_QUICK_REFERENCE.md](./.github/COPILOT_QUICK_REFERENCE.md) for command templates

**What Copilot Knows:**
- ✅ Project architecture and folder structure
- ✅ Technology stack (React 18, MUI v5, Plotly.js)
- ✅ Coding standards and anti-patterns
- ✅ Accessibility requirements (WCAG AA)
- ✅ Testing patterns and mocking strategies

### 1. Verification & Testing
We use `jest` and `react-testing-library` (standard Create React App setup).

- **Run Unit Tests:**
  ```bash
  npm test
  ```
  *Note: Press `a` to run all tests, or `q` to quit the watch mode.*

- **Linting:**
  The project uses standard ESLint configuration. Any linting errors will appear in the console during `npm start` or the build process.

### 2. Build & Deployment
To create an optimized production build:
```bash
npm run build
```
This generates a `build/` directory containing static assets (HTML, CSS, JS) ready for deployment. These files can be served by any static file server (Nginx, Apache, S3, Docker).

### 3. Coding Standards
- **Component Structure:** Reusable UI elements go in `src/components/`, while route-specific layouts go in `src/pages/`.
- **Styling:** We use a modular CSS approach. Create a corresponding `.css` file in `src/styles/` for each major component to avoid style leakage.
- **State:** Prefer functional components and Hooks (`useState`, `useEffect`) over class components.

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── basic/           # Layout components (Header, Sidebar, etc.)
│   ├── charts/          # Visualization components (Candlestick, MACD, etc.)
│   ├── containers/      # Complex logic containers & control panels
│   └── scheduler/       # Job Scheduler specific components
├── pages/               # Main route views
│   ├── StockAnalysisDashboard.js  # Unified Analysis View
│   ├── JobSchedulerPage.js        # Job Management View
│   ├── DataCollectionPage.js      # Data Fetching View
│   └── ...
├── services/            # API communication logic
│   └── api.js           # Centralized Axios instances & endpoints
├── hooks/               # Custom React Hooks
│   ├── useStockDataFetcher.js
│   └── useCandlestickPatterns.js
├── styles/              # CSS files (Component-specific styles)
└── utils/               # Helper functions
```

---

## Architecture & Design Patterns

This application leverages common design patterns to ensure code maintainability, scalability, and ease of onboarding for new developers.

### 1. Component Composition
**Description:** Composition is a method of constructing more complex objects using existing objects. In React, this means we can create more intricate UI elements by combining multiple components.

**Code Example:** 
The `BasePage` component exemplifies composition. It combines `Header`, `NavBar`, `Sidebar`, and `Footer` components and provides an area (`children` props) to display the main content.

```javascript
const BasePage = ({ children }) => (
    <div className="App">
        <Header title="Website Logo & Navigation" />
        <NavBar />
        <div className="App-content">
            <Sidebar />
            <main className="Main-content">
                {children}
            </main>
        </div>
        <Footer content="Footer Content" />
    </div>
);
```

### 2. Strategy Pattern
**Description:** The Strategy Pattern defines a series of algorithms and encapsulates each of them, making them interchangeable. In this React application, this is reflected in:
1.  **Routing:** Different routing paths correspond to different component strategies.
2.  **Analysis Modes:** The `StockAnalysisDashboard` uses an internal state (`analysisMode`) to switch between different visualization strategies (Quick View, Pattern Analysis, Technical Analysis) without changing the route.

### 3. Custom Hooks (Logic Abstraction)
**Description:** We abstract complex stateful logic into custom hooks to keep UI components clean and focused on rendering.

**Example:** `useStockDataFetcher`
Instead of handling loading states, error catching, and API calls directly in the component, we extract it:
```javascript
// src/hooks/useStockDataFetcher.js
const { fetchData, isLoading, error } = useStockDataFetcher('stock_data');
```

### 4. Service Layer Pattern
**Location:** `src/services/api.js`
All API interactions are encapsulated in a single service module. This creates a unified interface for the frontend to communicate with multiple backend microservices.
- **Why?** Our architecture splits "Data/Scheduling" and "Machine Learning" into separate backend services. The frontend unifies them here.
- **Features:**
  - Base URL configuration (via `.env`)
  - Timeout management
  - Error normalization
  - Request interceptors

---

## Component Introduction

### Key Pages & Modules

**1. StockAnalysisDashboard (Unified Dashboard)**
**Location:** `src/pages/StockAnalysisDashboard.js`
The successor to multiple fragmented visualization pages. It serves as the primary interface for technical analysis. It dynamically handles visualization types and manages the state for pattern recognition, indicator toggles, and data fetching.

**2. JobSchedulerPage (Scheduler Module)**
**Location:** `src/pages/JobSchedulerPage.js`
A dedicated management interface for the background job system. It uses a polling mechanism (via `useEffect` and `setInterval`) to keep the job status list up-to-date in real-time.

**3. BasePage (Layout Module)**
**Location:** `src/pages/BasePage.js`
The foundational layout component. All page views are wrapped in `BasePage` to ensure consistent navigation (Sidebar/Header) and styling structure.

**4. CandlestickDiagram (Chart Component)**
**Location:** `src/components/charts/CandlestickDiagram.js`
A reusable chart component based on `react-plotly.js`. It accepts data props and renders interactive financial charts. It is designed to be purely presentational, receiving its data from container components.

**5. api.js (API Service)**
**Location:** `src/services/api.js`
The bridge between Frontend and Backend. It exports named functions (e.g., `getScheduledJobs`, `fetchDataFromSource`) that correspond directly to backend endpoints.

---

### Styling Architecture

We follow a **Modular CSS** approach.
- **Global Styles:** `App.css` and `index.css` for app-wide resets and variables.
- **Component Styles:** Each component has a dedicated CSS file in `src/styles/` (e.g., `JobSchedulerPage.css` matches `JobSchedulerPage.js`). This makes it easy to locate and edit styles for specific features without side effects.