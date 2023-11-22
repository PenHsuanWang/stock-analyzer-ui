import React from 'react';
import Sidebar from '../components/basic/Sidebar';
import '../styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="HomePage">
      <Sidebar />
      <main className="Content">
        <section className="welcome-section">
          <h1>Welcome to the Stock Analysis Portal</h1>
          <p>Your one-stop shop for stock data analysis, insights discovery, and data visualization.</p>
        </section>

        <div className="feature-section">
          <div className="feature-card">
            <h2>Comprehensive Data Collection</h2>
            <p>Enter stock codes and dates to gather the data you need.</p>
          </div>
          <div className="feature-card">
            <h2>Advanced Data Analysis</h2>
            <p>Utilize cutting-edge algorithms to dissect and understand market trends.</p>
          </div>
          <div className="feature-card">
            <h2>Dynamic Data Visualization</h2>
            <p>Explore your data through various charts including Candlestick and Heatmap diagrams.</p>
          </div>
        </div>

        <section className="readme-section">
          <h2>Project Overview</h2>
          <p>Welcome to the Stock Analysis Portal, a sophisticated tool designed to facilitate the querying and visualization of stock information. This platform allows users to input stock codes and date ranges to retrieve and display closing stock prices within a specified timeframe. The intuitive interface presents the results in an accessible line chart format, enabling users to gain insights into stock performance at a glance.</p>
          
          <h2>Key Features</h2>
          <ul>
            <li>Comprehensive Data Collection: Enter stock codes and dates to gather the data you need.</li>
            <li>Advanced Data Analysis: Utilize cutting-edge algorithms to dissect and understand market trends.</li>
            <li>Dynamic Data Visualization: Explore your data through various charts including Candlestick and Heatmap diagrams.</li>
          </ul>
          
          <h2>Project Structure</h2>
          <p>Our project is structured in a modular fashion, encapsulating different functionalities within specific directories and components. This modular design ensures ease of maintenance and scalability as the project grows and evolves.</p>
          
          <h2>Usage Guide</h2>
          <p>Getting started is as simple as installing the required packages with <code>npm install</code>, ensuring your backend API server is running, and then launching the development server with <code>npm start</code>. Navigate to <code>http://localhost:3000</code> to access the homepage and begin your stock analysis journey.</p>
          
          <p>The combination of React's compositional capabilities, higher-order components, and the strategic pattern in routing configuration underpins the flexible and scalable architecture of our application. This thoughtful design approach guarantees a modular and maintainable structure, providing users with a seamless experience.</p>
          
          <p>Whether you are a seasoned investor or new to stock analysis, our platform is equipped to support your decision-making process with powerful tools and a user-friendly interface.</p>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
