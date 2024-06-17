import React, { useState, useEffect } from 'react';
import './style.scss';
import { useNavigate } from 'react-router-dom';
import { Cartesi } from '../ConnectionService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cartesi = new Cartesi();

// Define the Product type
interface Product {
  id: string;
  name: string;
  description: string;
}

const Company: React.FC = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [companyName, setCompanyName] = useState('Company');
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let response = await cartesi.getInspect('products');
        if (typeof response === 'string') {
          console.log('response is a string');
          try{
            //string 2 list
            response = response.replace(/'/g, '"');
            response = JSON.parse(response);
          }catch(error){
            console.error("Error parsing response:", error);
            toast.error('Errinho');
          }
        }
        console.log(typeof response, response)
        
        // Ensure response is an array and contains Product objects
        if (Array.isArray(response)) {
          setProducts(response as Product[]);
        } else {
          console.error("Expected an array but got:", response);
          toast.error('dnioa');
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error('Error fetching products');
      }
    };

    const checkWalletConnection = () => {
      const wallet = localStorage.getItem('connectedWallet');
      const company = localStorage.getItem('companyName');
      if (wallet) {
        setIsConnected(true);
        setCompanyName(company || 'Company');
      }
    };

    checkWalletConnection();
    fetchProducts();
  }, []);

  const handleConnection = () => {
    // Simulate wallet connection and set company name
    localStorage.setItem('connectedWallet', 'true');
    // Fazer Requisição para o backend para buscar o nome da empresa
    localStorage.setItem('companyName', 'Piet');
    setIsConnected(true);
    setCompanyName('Piet');
  };

  return (
    <div className="company-container">
      <h1>{`${companyName} Dashboard`}</h1>
      <p>This is a dashboard for adding products and visualizing the flow of product batches within the company.</p>
      <div className="products-section">
        <button className="add-product-button" onClick={() => navigate(`/registerproduct`)}>Add New Product</button>
        <div className="products-list">
          {
            products.map((product: Product) => (
              <div key={product.id} className="product-card">
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <button onClick={() => navigate(`/addbatch/${product.id}`)}>Add Batch</button>
              </div>
            ))
          }
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Company;
