import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.scss';

// Definição de tipos para o produto
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

export default function RegisterProduct() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [newProduct, setNewProduct] = useState<IProduct>({
        id: Math.random(),
        name: '',
        description: '',
        components: []
    });
    const [customComponent, setCustomComponent] = useState('');

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
        setNewProduct({ ...newProduct, components });
    };

    const handleAddCustomComponent = () => {
        if (customComponent && !Object.values(componentOptions).includes(customComponent)) {
            const nextKey = Object.keys(componentOptions).length + 1;
            componentOptions[nextKey.toString()] = customComponent;
            setNewProduct({
                ...newProduct,
                components: [...newProduct.components, nextKey.toString()]
            });
        }
        setCustomComponent('');
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setProducts([...products, newProduct]);
        setNewProduct({ id: Math.random(), name: '', description: '', components: [] });
    };

    return (
        <div className='register-product-container'>
            <h2>Register New Product</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={newProduct.name}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <input
                        type="text"
                        name="description"
                        value={newProduct.description}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Components:</label>
                    <select multiple={true} value={newProduct.components} onChange={handleComponentChange}>
                        {Object.keys(componentOptions).map(key => (
                            <option key={key} value={key}>{componentOptions[key]}</option>
                        ))}
                    </select>
                    <div className='custom-component-container'>
                        <input
                            type="text"
                            placeholder="Add custom component"
                            value={customComponent}
                            onChange={(e) => setCustomComponent(e.target.value)}
                        />
                        <button type="button" onClick={handleAddCustomComponent}>Add Component</button>
                    </div>
                </div>
                <button type="submit">Add Product</button>
            </form>

            <div className='product-list'>
                <h2>Products List</h2>
                {products.map((product, index) => (
                    <div className='product-item' key={index}>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>Components: {product.components.map(key => componentOptions[key]).join(', ')}</p>
                        <button onClick={() => navigate(`/addbatch`)}>Add Batch</button>
                    </div>
                ))}
            </div>
        </div>
    );
    }
    
/*  <button onClick={() => navigate(`/addbatch/${product.id}`)}>Add Batch</button> */