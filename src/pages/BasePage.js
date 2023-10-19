// BasePage.js
import React from 'react';
import Header from '../components/basic/Header';
import NavBar from '../components/basic/NavBar';
import Footer from '../components/basic/Footer';
import Sidebar from '../components/basic/Sidebar';
import '../styles/BasePage.css';

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

export default BasePage;
