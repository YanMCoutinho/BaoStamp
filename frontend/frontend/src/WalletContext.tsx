import React, { createContext, useContext, useEffect } from 'react';
import { useConnectWallet, useWallets } from "@web3-onboard/react";

interface WalletContextProps {
    wallet: any;
    connect: () => Promise<any>;
    disconnect: (wallet: any) => Promise<void>;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [{ wallet }, connect, disconnect] = useConnectWallet();
    const connectedWallets = useWallets();

    const handleDisconnect = async () => {
        if (wallet) {
            await disconnect(wallet);
        }
    };

    useEffect(() => {
        if (connectedWallets.length > 0 && !wallet) {
            connect();
        }
    }, [connectedWallets, wallet, connect]);

    return (
        <WalletContext.Provider value={{ wallet, connect, disconnect: handleDisconnect }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};
