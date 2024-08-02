import './style.scss';
import React from 'react';
import BaoStampLogo from '../assets/BaoStampLogo.png';

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="head">
                <a href="/">
                    <img src={BaoStampLogo} alt="Illustration" className="floating-image" />
                </a>
            </div>
        </header>
    );
}

export default Header;