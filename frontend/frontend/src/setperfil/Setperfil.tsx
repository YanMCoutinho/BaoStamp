import React, { useState } from 'react';
import { Cartesi } from '../utils/ConnectionService';
import './style.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../header/Header';

export default function SetPerfil() {
    const [isConnecting, setIsConnecting] = useState(false);

    let cartesi: Cartesi | null = null;

  try {
    cartesi = new Cartesi();
  } catch (error) {
    console.error("Error initializing Cartesi:", error);
    toast.error('Error initializing Cartesi');
  }

    async function handleCompanyClick() {
    console.log('handleCompanyClick');

        if (!isConnecting) {
            setIsConnecting(true);
            try {
                const account = await cartesi?.connectWallet();
                
                if(account){
                    let isUser = await cartesi?.isUserSigned();
                    if(isUser){
                        toast.success('Connected to wallet');
                        //esperar 3 segundos para redirecionar
                        setTimeout(() => {
                            window.location.href = '/company';
                            console.log('redirecting to company');
                        }, 3000);
                    }else{
                        setIsConnecting(false);
                        toast.error('User not signed');
                        setTimeout(() => {
                            console.log('redirecting to sign');
                            window.location.href = '/sign';
                        }
                        , 3000);
                    }
                }else{
                    setIsConnecting(false);
                }
                } catch (error) {
                console.error(error);
                }
            }
    }

    return (
        <div className="set-perfil-container">
            < Header />
            <h1>Select Your Role</h1>
            <div className="options">
                <div className="option" onClick={handleCompanyClick}>
                    <h2>Company</h2>
                    <p>Register your products and issue seals</p>
                    <ul>
                        <li>Build trust with your customers</li>
                        <li>Ensure product authenticity</li>
                        <li>Track and manage your supply chain</li>
                        <li>Promote sustainability and eco-friendly practices</li>
                    </ul>
                </div>
                <div className="option" onClick={() => window.location.href = '/costumers'}>
                    <h2>Customer</h2>
                    <p>View the supply chain of registered products</p>
                    <ul>
                        <li>Verify product authenticity</li>
                        <li>Gain transparency into product origins</li>
                        <li>Support brands that value sustainability</li>
                    </ul>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
