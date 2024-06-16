import React, { useState, useEffect } from 'react';
import './style.scss';
import { useNavigate } from 'react-router-dom';
import { Cartesi } from '../ConnectionService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cartesi = new Cartesi();

const Company: React.FC = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [companyName, setCompanyName] = useState('Company');
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (!cartesi.isConnected()) {
      navigate('/setperfil');
    }
    cartesi.getInspect('products').then((response) => {
      if (response) {
        setProducts(response as any[]);
      } else {
        toast.error('No products found');
      }
    });

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

  const addBatch = (productId: number) => {
    // Logic to add a new batch to a product
  };

  const isProduct = (product: any): product is { id: number, name: string, description: string, batches: any[] } => {
    return product && typeof product.id === 'number';
  };

  return (
    <div className="company-container">
      <h1>{`${companyName} Dashboard`}</h1>
      <p>This is a dashboard for adding products and visualizing the flow of product batches within the company.</p>
      <div className="products-section">
        <button className="add-product-button" onClick={() => navigate(`/registerproduct`)}>Add New Product</button>
        <div className="products-list">
          {products && products.length > 0 ? (
            products.map((product) => (
              isProduct(product) ? (
                <div key={product.id} className="product-item">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <button onClick={() => navigate(`/addBatch/${product.id}`)}>Add New Batch</button>
                  {product.batches && product.batches.length > 0 ? (
                    <ul>
                      {product.batches.map((batch: any, index: number) => (
                        <li key={index}>Batch {index + 1}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No batches available</p>
                  )}
                </div>
              ) : (
                <p key={product.id}>No products available</p>
              )
            ))
          ) : (
            <p>No products available</p>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Company;
