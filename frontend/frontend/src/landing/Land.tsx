import './style.scss';
import React from 'react';
import Header from '../header/Header';

export default function Intro() {
    return (
        <div>
            <div className="App">
                < Header />
                 <section className="hero">
                    <div className="container">
                        <div>
                            <h1 className="container-text">Welcome to</h1>
                            <h1 className="container-bao">Y-Open Data</h1>
                        </div>
                        <p className="container-p">An internacional seal of transparency and sustentability in the textile industry's production chain</p>
                        <a href='/setperfil'><button>Join the revolution</button></a>
                    </div>
                </section>
                <section className="divider">
                    <div className="divider-container">
                        <div className="divider-text">
                            <p>Simple Integration with Blockchain</p>
                        </div>
                        <div className="divider-text">
                            <p>Data Verification</p>
                        </div>
                        <div className="divider-text">
                            <p>Intelligent Analysis with AI</p>
                        </div>
                    </div>
                </section>
                <section className="features">
                    <div className="feature-list">
                        <div className="feature">
                            <h2>Unmatched Transparency with Blockchain</h2>
                            <p>Blockchain technology ensures immutable and publicly accessible production data, providing complete product traceability and enhancing brand trust by offering consumers verifiable information about product origins and manufacturing.</p>
                        </div>
                        <div className="feature">
                            <h2>Efficient Management with Tokenization</h2>
                            <p>Tokens represent each step of the production process, automating and streamlining information management and verification across the supply chain while reducing bureaucracy and ensuring efficient, secure data management.</p>
                        </div>
                        <div className="feature">
                            <h2>Advanced Analytics with Artificial Intelligence</h2>
                            <p>AI processes large data volumes to provide insights into production chain sustainability and efficiency, enabling informed decisions and optimization of sustainable practices to enhance environmental responsibility and operational efficiency.</p>
                        </div>
                    </div>
                </section>
                <section className="features">
                    <h2>Join the Sustainable Fashion Revolution</h2>
                    <div className='features-div'>
                        <p className="container-p">Adopting the BaoStamp seal is a decisive step towards transforming your brand into an icon of transparency, sustainability, and ethics. Don't fall behind – be part of the revolution shaping the future of fashion.</p>

                    </div>
            </section>
            </div>
        </div>
    );
}