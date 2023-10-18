import React from 'react';
import Header from '../views/Header';
import NavBar from '../views/NavBar';
import Footer from '../views/Footer';
import ImageGrid from '../views/ImageGrid';
import logo from '../logo.svg';

function HomePage() {
  const images = [
    { id: 1, src: logo, alt: 'Logo' },
    { id: 2, src: logo, alt: 'Logo' },
    { id: 3, src: logo, alt: 'Logo' },
    { id: 4, src: logo, alt: 'Logo' },
  ];

  return (
    <div className="App">
      <Header title="Website Logo & Navigation" />
      <NavBar />

      <div className="App-content">
        <main className="Main-content home-page">
          <h1>Welcome to the Home Page</h1>
          <p>This is the home page content. You can customize it as needed.</p>
          <ImageGrid images={images} />
        </main>
      </div>

      <Footer content="Footer Content" />
    </div>
  );
}

export default HomePage;
