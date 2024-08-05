import React from 'react';
import './Loading.scss';

const Loading = () => {
    return (
        <div className="loading-overlay">
            <div className="loading-spinner"></div>
        </div>
    );
};

export default Loading;