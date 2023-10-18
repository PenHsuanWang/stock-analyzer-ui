import React from 'react';
import Header from '../views/Header';
import NavBar from '../views/NavBar';
import Footer from '../views/Footer';
import logo from '../logo.svg';

import '../App.css';

class ChartBasePage extends React.Component {
    render() {
        return (
            <div className="App">
                <Header title="Website Logo & Navigation" />
                <div className="App-content"> 
                    <NavBar />
                    <main className="Main-content">
                        {this.props.children} {/* 使用 children 属性讓子組件能插入到這裡 */}
                    </main>
                </div>

                <Footer content="Footer Content" />
            </div>
        );
    }
}

export default ChartBasePage;
