import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css'; // Import the CSS file
import logo from '../logo.svg'; // Import your images

function HomePage() {
  const images = [
    { id: 1, src: logo, alt: 'Logo' },
    { id: 2, src: logo, alt: 'Logo' },
    { id: 3, src: logo, alt: 'Logo' },
    { id: 4, src: logo, alt: 'Logo' },
  ];

  return (
    <div className="App">
      <header className="App-header">Website Logo & Navigation</header>
      <nav>Navigation Bar / Menu</nav>

      <div className="App-content">
        <main className="Main-content home-page">
          <h1>Welcome to the Home Page</h1>
          <p>This is the home page content. You can customize it as needed.</p>

          <div className="image-grid">
            {images.map((image) => (
              <Link to="/stock-ma-plot" key={image.id} className="grid-item">
                <img src={image.src} alt={image.alt} />
              </Link>
            ))}
          </div>
        </main>
      </div>

      <footer>Footer Content</footer>
    </div>
  );
}

export default HomePage;
