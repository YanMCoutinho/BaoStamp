import './style.scss';
import React, { useEffect } from 'react';
import { useSetChain } from "@web3-onboard/react";
import configFile from "../config.json";
import { useWallet } from "../WalletContext";

const config: any = configFile;

export default function SetPerfil() {
    const { wallet, connect } = useWallet();
    const [{ chains, connectedChain, settingChain }, setChain] = useSetChain();

    useEffect(() => {
        const initializeConnection = async () => {

            if (wallet && !connectedChain) {
                await setChain({ chainId: Object.keys(config)[0] });
                window.location.href = '/company';
            }
            if(wallet && connectedChain){
                window.location.href = '/company';
            }
        };

        initializeConnection();
    }, [wallet, connectedChain, setChain, connect]);

    const handleCompanyClick = async () => {
        if (!wallet) {
            const connectedWallets = await connect();
            if (connectedWallets && connectedWallets.length > 0) {
                if (!connectedChain) {
                    await setChain({ chainId: Object.keys(config)[0] });
                }
                
            }
        } else {
            if (!connectedChain) {
                await setChain({ chainId: Object.keys(config)[0] });
            }
            window.location.href = '/company';
        }
    };

    return (
        <div className="set-perfil-container">
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
                <div className="option" onClick={() => window.location.href = '/cliente'}>
                    <h2>Customer</h2>
                    <p>View the supply chain of registered products</p>
                    <ul>
                        <li>Verify product authenticity</li>
                        <li>Gain transparency into product origins</li>
                        <li>Support brands that value sustainability</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
