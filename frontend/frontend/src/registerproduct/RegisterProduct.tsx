import React, { useState } from 'react';
import './styles.scss';
import injectedModule from "@web3-onboard/injected-wallets";
import { init } from "@web3-onboard/react";
import { ethers } from "ethers";
import { useRollups } from "../useRollups";
import { useWallets, useConnectWallet } from "@web3-onboard/react";

import configFile from "../config.json";

const config: any = configFile;

const injected: any = injectedModule();
init({
    wallets: [injected],
    chains: Object.entries(config).map(([k, v]: [string, any], i) => ({id: k, token: v.token, label: v.label, rpcUrl: v.rpcUrl})),
    appMetadata: {
        name: "Cartesi Rollups Test DApp",
        icon: "<svg><svg/>",
        description: "Demo app for Cartesi Rollups",
        recommendedInjectedWallets: [
            { name: "MetaMask", url: "https://metamask.io" },
        ],
    },
});

// Definição de tipos para o produto
interface IProduct {
    id: number;
    name: string;
    description: string;
    components: string[];
}

// Validar com o time back
const componentOptions: { [key: string]: string } = {
    "1": "Polyester",
    "2": "Nylon",
    "3": "Recycled Poly",
    "4": "Cotton",
    "5": "Wool",
    "6": "Microfiber",
    "7": "Tencel",
    "8": "Linen",
    "9": "Synthetic Blend"
};

export default function RegisterProduct(propos: { dappAddress: string }) {
    const [newProduct, setNewProduct] = useState<IProduct>({
        id: Math.random(),
        name: '',
        description: '',
        components: []
    });
    const [dappAddress, setDappAddress] = useState<string>("0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e");
    //pegar wallet das wallets conectadas
    const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
    const rollups = useRollups(dappAddress);

    const [connectedWallet] = useWallets();
    const [hexInput, setHexInput] = useState<boolean>(false);



    

    const sendAddress = async (str: string) => {
        console.log(`Sending address: ${str} to ${propos.dappAddress}`);
        if (rollups) {
            try {
                await rollups.relayContract.relayDAppAddress(propos.dappAddress);
            } catch (e) {
                console.log(`${e}`);
            }
        }
    };

    async function sendInput(input: string = "") {
        console.log(`Sending input: ${input} to ${propos.dappAddress}`);
        console.log(`Connected wallet: ${connectedWallet}`);
        console.log(`rollups: ${rollups}`);
        if (rollups) {
            try {
                let payload = ethers.utils.toUtf8Bytes(input);
                if (hexInput) {
                    payload = ethers.utils.arrayify(input);
                }
                await rollups.inputContract.addInput(propos.dappAddress, payload);
            } catch (e) {
                console.log(`${e}`);
            }
        }else{
            console.log("Rollups is null");
        }
    };

    const [customComponent, setCustomComponent] = useState('');
    const [selectedComponents, setSelectedComponents] = useState<string[]>([]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleComponentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { options } = event.target;
        const components: string[] = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                components.push(options[i].value);
            }
        }
        setSelectedComponents(components);
        setNewProduct({ ...newProduct, components });
    };

    const handleAddCustomComponent = () => {
        if (customComponent && !Object.values(componentOptions).includes(customComponent)) {
            const nextKey = Object.keys(componentOptions).length + 1;
            componentOptions[nextKey.toString()] = customComponent;
            setSelectedComponents([...selectedComponents, nextKey.toString()]);
            setNewProduct({
                ...newProduct,
                components: [...newProduct.components, nextKey.toString()]
            });
        }
        setCustomComponent('');
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
    
        // Prepare the new product data
        const newInput = JSON.stringify({ type: 1, data: newProduct });
        console.log(newInput);
        
        // Attempt to add the input
        await sendInput(newInput);
    };

    return (
        <div className='register-product-container'>
            {
                wallet ? (
                    <div>
                        <button onClick={() => disconnect(wallet)}>Disconnect Wallet</button>
                    </div>
                ) : (
                    <button onClick={() => connect()}>Connect Wallet</button>
                )
            }
            <h2>Register New Product</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Product Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={newProduct.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Product Description:</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={newProduct.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="components">Select Components:</label>
                    <select
                        id="components"
                        multiple={true}
                        value={newProduct.components}
                        onChange={handleComponentChange}
                    >
                        {Object.keys(componentOptions).map(key => (
                            <option key={key} value={key}>{componentOptions[key]}</option>
                        ))}
                    </select>
                </div>
                <div className='custom-component-container'>
                    <input
                        type="text"
                        placeholder="Add custom component"
                        value={customComponent}
                        onChange={(e) => setCustomComponent(e.target.value)}
                    />
                    <button type="button" onClick={handleAddCustomComponent}>Add Component</button>
                </div>
                <div className="selected-components">
                    <h3>Selected Components:</h3>
                    <ul>
                        {selectedComponents.map(key => (
                            <li key={key}>{componentOptions[key]}</li>
                        ))}
                    </ul>
                </div>
                <button type="submit" className="submit-button">Register Product</button>
            </form>
        </div>
    );
}
