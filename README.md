# Documents

## Project Overview

This project offers a tool for querying stock information and visualizing it. Users can provide stock codes and date ranges via the input box to query the closing stock prices within the specified date range. The query results are presented in the form of a line chart on the screen.

### Project Structure

```
/my-project
|-- /node_modules
|-- /public
|-- /src
    |-- /assets
    |-- /components
        |-- /Basic
            |-- /Header
            |-- /Footer
            |-- /Sidebar
            |-- /Main
        |-- /Forms
        |-- /Lists
        |-- /Charts
        |-- /Widgets
            |-- /Buttons
            |-- /Modals
            |-- /Tooltips
            |-- /Badges
            |-- /Alerts
            |-- /Spinners
        |-- /Containers
            |-- StockSearchControls.js
    |-- /contexts
    |-- /hooks
    |-- /services
    |-- /styles
    |-- /utils
    |-- /tests
    |-- /pages
        |-- BasePage.js
        |-- WelcomePage.js
        |-- DataControlPage.js
        |-- DataSearchPage.js
        |-- DataVisualizationPage.js
        |-- CandlestickDiagram.js
|-- package.json
|-- ...
```

### Component Introduction:

App.js is the startup entry point for the entire UI program.

App.js calls pages and provides various components to the pages, offering a complete page layout.

Different pages are implemented in src/pages.
Components to be passed into the pages are implemented in src/components.
Components are further categorized as follows:
 - Basic: Includes Header, Footer, NavBar, Sidebar, and other basic page components.
 - Forms: Components for rendering data tables are implemented here.
 - Lists: Components for rendering list-type items are implemented here, e.g., data list.
 - Charts: Components for rendering chart types are implemented here, e.g., various plotly diagrams.
 - Widgets: Various tools, buttons, ... etc.
 - Containers: Various interactive units, e.g., text input boxes... etc.

Tasks other than UI, such as functions triggered by buttons, etc., interfaces for interaction are implemented in services.
All individual CSS are placed under styles.

### Page Rendering Structure

BasePage.js is used as the base template for all pages. It provides the layout for Header, NavBar, Footer, and Sidebar. The main screen position (Main block) is defined. The other page components are arranged within the Main.

Other feature pages all operate within the Main block, operations in main are implemented in another any_name_Page.js.
Page is responsible for defining the webpage layout and then passing different functional components into each block.

As an example, consider a webpage that displays a line chart of stock prices over time. The object relationship diagram is as follows:

```
                      Reenter various components
                           |
App.js startup -----------> Calls page -> Sets Route path
                           |
                           |
BasePage.js -> DataVisualizePage.js
```

## Introduction to Main Components and Modules

**2.1 BasePage (Base Page Module)**

`BasePage` serves as the foundational page for the entire application, responsible for presenting common frameworks such as Header, Footer, Sidebar, NavBar, and Main block.

**Location:** `page/BasePage.js`

**2.2 DataVisualizationPage (Data Visualization Page Module)**

`DataVisualizationPage` is the primary page for stock information query and visualization. It takes in `ChartComponent` and `ControlComponent` as inputs and manages chart data updates using `useState`.

**Location:** `page/DataVisualizationPage.js`

**2.3 StockDiagram (Stock Chart Component)**

`StockDiagram` uses the `react-plotly.js` library to present queried stock information. It takes a `data` prop to display chart data.

**Location:** `components/charts/StockDiagram.js`

**2.4 StockSearchControls (Stock Query Control Component)**

`StockSearchControls` is the main component for stock querying. Users can input stock codes and date ranges using the input fields provided by this component and fetch data by clicking the query button. The component updates the `DataVisualizationPage` state via the `setChartData` prop.

**Location:** `components/containers/StockSearchControls.js`

**2.5 dataService (Data Service Module)**

This module offers methods to retrieve stock data from the backend API, including `fetchData` and `fetchMaChartData`.

**Location:** `services/dataServices.js`

## Design Patterns and Logic

### 1. Application of Composition 

**Description:** Composition is a method of constructing more complex objects using existing objects. In React, this means we can create more intricate UI elements by combining multiple components. Composition allows us to reuse code, logic, or UI segments, ensuring low coupling and high cohesion between modules.

**Code Example:** 
The `BasePage` component exemplifies composition. It combines `Header`, `NavBar`, `Sidebar`, and `Footer` components and provides an area (`children` props) to display the main content.
```javascript
const BasePage = ({ children }) => (
    <div className="App">
        <Header title="Website Logo & Navigation" />
        <NavBar />
        ...
        <main className="Main-content">
            {children}
        </main>
        ...
    </div>
);
```

   1. **Basic Component Composition:** `BasePage.js` demonstrates combining basic UI components like Header, NavBar, Sidebar, and Footer. Through component combination, each section can be developed, tested, and reused independently.

   2. **Data Visualization Component Composition:** `DataVisualizationPage.js` dynamically composes content by accepting external `ChartComponent` and `ControlComponent`. This pattern makes page layout and functionality separation more flexible, allowing for combinations of different charts and control components based on need.

Components are decided in `App.js`, determining where and which components should be used, then passed to `DataVisualizationPage` via props. This pattern not only makes component combination more flexible but also facilitates future expansion and refactoring. For instance, for the stock information query feature, you've utilized `StockSearchControls` to capture user input and then relayed this info to `StockDiagram` to display the corresponding chart.

**Future Expansion Methods**

If you wish to continue expanding using the composition method, here are some suggestions:

 1. **Incorporating New Components:** If there are future fundamental UI components or features, you can simply create a new component and integrate it where needed using composition.

 2. **Modularizing Features:** When adding new data visualization tools or control panels, you can emulate the pattern of `StockDiagram` and `StockSearchControls`, establishing separate data visualization and control components, then combining them in `App.js`.

 3. **Plug-and-play:** Through component combination, you can easily replace some functionalities, like swapping out different chart libraries or control panels, without affecting other segments.

### 2. Higher-Order Components (HOC)

**Description:**

Higher-Order Components (HOC) are an advanced technique in React for reusing component logic. An HOC is a function that takes a component as a parameter and returns a new component. This pattern allows us to wrap components with another one to add some additional properties or behaviors without modifying the component itself.

**Example in Your Code:**

`DataVisualizationPage` can be considered a component that simulates HOC. Although it's not an HOC in the traditional sense, it demonstrates similar behavior, as it takes other components (`ChartComponent` and `ControlComponent`) as props and decides how to render them.

```javascript
function DataVisualizationPage({ ChartComponent, ControlComponent }) {
    ...
    {ControlComponent && <ControlComponent setChartData={setChartData} />}
    ...
    {ChartComponent && <ChartComponent data={chartData} />}
    ...
}
```

**How It Works:**

When deciding which components to use in `App.js`, they are passed as props to `DataVisualizationPage`. This approach provides `DataVisualizationPage` with dynamic composition capabilities, allowing it to decide on presentation and behavior

. In this pattern, you can introduce different data visualization tools or control panels without altering the `DataVisualizationPage` structure.

**Expanding With HOCs:**

To further utilize HOCs:

 1. **Adding Functionality:** You could wrap existing components in HOCs to provide them with additional logic or state management.
 2. **Styling & Theming:** HOCs can be utilized to modify the styles of wrapped components dynamically.
 3. **Access Control:** Implementing authentication or access control logic within HOCs can help in displaying components based on user roles.

### 3. Strategy Pattern

**Description:** The Strategy Pattern defines a series of algorithms and encapsulates each of them, making them interchangeable. The main purpose of this pattern is to separate the use of algorithms from their implementation, providing a mechanism to choose different strategies. In React applications, the Strategy Pattern is mainly reflected in the dynamic replacement and configuration of components, corresponding to different scenarios or functional requirements.

**Code Example:**  
In the routing configuration of `App.js`, we can observe the utilization of the Strategy Pattern. Specifically, different routing paths correspond to different component strategies. For example, when the route is `/stock-ma-plot`, the `DataVisualizationPage` component will dynamically display the corresponding components based on the provided `ChartComponent` and `ControlComponent` strategies.

```javascript
<Route 
  path="/stock-ma-plot" 
  element={
    <DataVisualizationPage 
      ChartComponent={StockDiagram} 
      ControlComponent={StockSearchControls}
    />
  } 
/>
```

**How It Works:**  
Through routing configuration, multiple component combination strategies are defined. These strategies can be dynamically switched based on user requirements or different functional modules. When a user accesses a specific route, the corresponding component strategy is activated, ensuring the page presentation and functionality match the route.

**Advantages:**  

1. **Flexibility:** The Strategy Pattern provides a mechanism that allows us to dynamically replace components or functionalities based on different requirements or scenarios without modifying existing code.

2. **Decoupling:** This pattern ensures that the implementation and use of strategies are separate. This means when we need to add or modify a strategy, other parts of the code won't be affected.

3. **Scalability:** When requirements change or new functionalities are added, just add the corresponding strategy and configure it in the routes without significant refactoring.

The Strategy Pattern in React development, especially in component composition and routing configuration, offers potent flexibility and scalability. In this project, the combination of composition, higher-order components, and the strategy pattern ensures a clear, modular, and maintainable overall structure.

---

- **Composition:** We often use composition to create more complex components. For instance, the `BasePage` component combines several child components to create a unified page layout.

- **Higher-Order Components (HOC):** Some components operate like HOCs, accepting other components as parameters and rendering dynamically based on those components. This offers high reusability and flexibility.

- **Strategy Pattern:** In configuring routes, this project employs the Strategy Pattern. This means we can effortlessly provide different component combinations for different routes.

By adhering to these design principles, the modularity and maintainability of the project are ensured.

## 3. Usage

### 3.1 Installing Required Packages

Execute the following command in the root directory of the project to install the necessary npm packages:

```bash
npm install react-router-dom react-plotly.js axios
```

### 3.2 Launching the Development Server

Ensure that the backend API server is running and adjust the API address in `dataService` based on your backend configuration.

Execute the following command in the root directory of the project to launch the React development server:

```bash
npm start
```

Open a browser and navigate to `http://localhost:3000`. You should be able to see the application's homepage. Proceed to the stock information query page, enter the stock code and date range, then click the search button. After a brief wait, you should be able to see the stock chart information at the bottom of the page.