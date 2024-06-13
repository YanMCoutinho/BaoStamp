import React, { useState, useEffect } from 'react';
import './styles.scss';
import { ethers } from "ethers";
import { useRollups } from "../useRollups";
import { useWallet } from '../WalletContext';
import configFile from "../config.json";
import { Notices } from '../Notices';

const config: any = configFile;


interface IProduct {
    id: number;
    name: string;
    description: string;
    components: string[];
}

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

export default function RegisterProduct(props: { dappAddress: string }) {
    const [newProduct, setNewProduct] = useState<IProduct>({
        id: Math.random(),
        name: '',
        description: '',
        components: []
    });
    const { wallet, connect, disconnect } = useWallet();
    const rollups = useRollups(props.dappAddress);

    const [hexInput, setHexInput] = useState<boolean>(false);
    const [customComponent, setCustomComponent] = useState('');
    const [selectedComponents, setSelectedComponents] = useState<string[]>([]);

    useEffect(() => {
        if (!wallet) {
            connect();
        }
    }, [wallet, connect]);

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
        const newInput = JSON.stringify({ type: 0, data: newProduct });
        await sendInput(newInput);
    };

    async function sendInput(input: string = "") {
        if (rollups) {
            try {
                console.log(rollups)
                let payload = ethers.utils.toUtf8Bytes(input);
                if (hexInput) {
                    payload = ethers.utils.arrayify(input);
                }
                await rollups.inputContract.addInput(props.dappAddress, payload);
            } catch (e) {
                console.error(`Error sending input: ${e}`);
            }
        } else {
            console.error("Rollups is null");
        }
    }

    return (
        <div className='register-product-container'>
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
            <Notices></Notices>
        </div>
    );
}
