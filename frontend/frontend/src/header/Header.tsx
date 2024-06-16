import './style.scss';
import React from 'react';
import BaoStampLogo from '../assets/BaoStampLogo.svg';

const Header: React.FC = () => {
    return ( 
    <header className="header">
        <div className="head">
        <a href="/land">
            <img src={BaoStampLogo} alt="Illustration" className="floating-image" />
        </a>
            <nav>
            <ul>
                <li>Home</li>
                <li>About</li>
                <li>Services</li>
                <li>Contact</li>
            </ul>
        </nav>
    </div>
</header>
);
}

export default Header;