import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cartesi } from '../utils/ConnectionService';
import { ToastContainer, toast } from 'react-toastify';
import { ethers } from "ethers";
import './style.scss';
import Header from '../header/Header';

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
  const [tokensList, setTokensList] = useState<string[]>([]);
  const [urls, setUrls] = useState<any[]>([]);

  let cartesi: Cartesi | null = null;

  try {
    cartesi = new Cartesi();
  } catch (error) {
    console.error("Error initializing Cartesi:", error);
    toast.error('Error initializing Cartesi');
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let response = await cartesi?.getInspect('products');
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
        }
        let tokens = await cartesi?.getInspect('tokens').then((response) => {
          if (typeof response === 'string') {
            try{
              response = response.replace(/'/g, '"');
              response = JSON.parse(response);
            }catch(error){
              console.error("Error parsing response:", error);
              toast.error('Error parsing response');
            }
          }
          if (Array.isArray(response)) {
            setTokensList(response);
          
          }else{
            console.error("Expected an array but got:", response);
            toast.error('Expected an array but got');
          }
        })
       
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
    localStorage.setItem('connectedWallet', 'true');
    localStorage.setItem('companyName', 'Piet');
    setIsConnected(true);
    setCompanyName('Piet');
  };
  return (
      <div className="company-container">
        < Header />
        <h1>{`${companyName} Dashboard`}</h1>
        <p>This is a dashboard for adding products and visualizing the flow of product batches within the company.</p>
        <div className='products-section'>
          <button onClick={() => navigate(`/registerproduct`)} className='add-product-button'>Add New Product</button>
          <div className='products-list'>
            {
              products.map((product: Product) => (
                <div key={product.id} className='product-item'>
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