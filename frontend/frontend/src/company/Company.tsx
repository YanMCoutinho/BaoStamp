import React, { useState, useEffect } from 'react';
import './style.scss';
import { Network } from '../Network';
import { useNavigate } from 'react-router-dom';

const Company = () => {
    const navigate = useNavigate();
    const [isConnected, setIsConnected] = useState(false);
    const [companyName, setCompanyName] = useState('Company');

    useEffect(() => {
        const checkWalletConnection = () => {
            const wallet = localStorage.getItem('connectedWallet');
            const company = localStorage.getItem('companyName');
            if (wallet) {
                setIsConnected(true);
                setCompanyName(company || 'Company');
            }
        };

        checkWalletConnection();
    }, []);

    const handleConnection = () => {
        // Simulate wallet connection and set company name
        localStorage.setItem('connectedWallet', 'true');
        // Fazer Requisição para o backend para buscar o nome da empresa
        localStorage.setItem('companyName', 'Piet');
        setIsConnected(true);
        setCompanyName('Piet');
    };

    // Fazer Requisição para o backend para buscar os produtos
    const products = [
        { id: 1, name: 'Product 1', description: 'Description of Product 1', batches: [] },
        { id: 2, name: 'Product 2', description: 'Description of Product 2', batches: [] },
        { id: 3, name: 'Product 3', description: 'Description of Product 3', batches: [] },
    ];

    const addBatch = (productId: number) => {
        // Logic to add a new batch to a product
    };

    return (
        <div className="company-container">
            <h1>{`${companyName} Dashboard`}</h1>
            {!isConnected ? (
                <div className="connect-button">
                    <Network />
                    <button onClick={handleConnection}>Simulate Connection</button>
                </div>
            ) : (
                <div className="products-section">
                    <button className="add-product-button" onClick={() => navigate(`/registerproduct`)}>Add New Product</button>
                    <div className="products-list">
                        {products.map(product => (
                            <div key={product.id} className="product-item">
                                <h3>{product.name}</h3>
                                <p>{product.description}</p>
                                <button onClick={() => navigate(`/addBatch`)}>Add New Batch</button>
                                <ul>
                                    {product.batches.map((batch, index) => (
                                        <li key={index}>Batch {index + 1}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Company;
