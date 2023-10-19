// HomePage.js
import React from 'react';
import BasePage from './BasePage';
import ImageGrid from '../components/views/layout/ImageGrid';
import logo from '../logo.svg';

function HomePage() {
    const images = [
        { id: 1, src: logo, alt: 'Logo' },
        { id: 2, src: logo, alt: 'Logo' },
        { id: 3, src: logo, alt: 'Logo' },
        { id: 4, src: logo, alt: 'Logo' },
    ];

    return (
        <BasePage>
            <h1>Welcome to the Home Page</h1>
            <p>This is the home page content. You can customize it as needed.</p>
            <ImageGrid images={images} />
        </BasePage>
    );
}

export default HomePage;
