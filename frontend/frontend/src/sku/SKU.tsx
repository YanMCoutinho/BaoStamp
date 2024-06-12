import './style.scss';
import React, {useState, useEffect} from 'react';

export default function SKU() {

    const [product, setProduct] = useState({
        "product_name": "name",
        "product_description": "description",
        "steps": [
            {
            "step": 1,
            "process": "process_name",
            "inputs": {
                "item_name": "qtd"
            },
            "output": {
                "item_name": "qtd"
            },
            "date_init": "2023-01-01",
            "date_end": "2023-07-01",
            "desc": ""
            },
            {
            "step": 1,
            "process": "process_name",
            "inputs": {
                "item_name": "qtd"
            },
            "output": {
                "item_name": "qtd"
            },
            "date_init": "2023-01-01",
            "date_end": "2023-07-01",
            "desc": ""
            }
        ],
        "active": true
    });


    const retunOfTheProduct = {"product_name": "Nike Dri-FIT Uniform Shirts",
        "product_description": "Elevate your daily workout with the Nike Dri-FIT T-Shirt. The soft, stretchy fabric wicks sweat away from your skin to help you stay focused and perform at your best. This product is made with 100% recycled polyester fabric.",
        "steps": [
            {
            "step": 1,
            "process": "Raw Material Collection",
            "inputs": {
                "item_name": "Polyester fabric scraps"
            },
            "output": {
                "item_name": "Cotton, polyester, nylon, wool, microfiber, tencel, pnen, synthetic blend"
            },
            "date_init": "2023-01-01",
            "date_end": "2023-07-01",
            "desc": ""
            },
            {
            "step": 2,
            "process": "process_name",
            "inputs": {
                "item_name": "qtd"
            },
            "output": {
                "item_name": "qtd"
            },
            "date_init": "2023-01-01",
            "date_end": "2023-07-01",
            "desc": ""
            }
        ],
        "active": true
      }

    useEffect(() => {
        setProduct(retunOfTheProduct);
    } , []);

     
    return (
        <div className="sku-container">
            <h1>Visualize a Product</h1>
            {
            product.product_name == "name" ?
            
            <h1>nada</h1>

             :

             <div className="sku">
             <div className="sku-header">
                <h2>{product.product_name}</h2>
                 <p>{product.product_description}</p>
             </div>
            <table>
                <thead>
                    <tr>
                        <th>Stage</th>
                        <th>Process</th>
                        <th>Start Date</th>
                        <th>Input Material</th>
                        <th>Final Date</th>
                        <th>Output Material</th>
                    </tr>
                </thead>
                <tbody>
                    {product.steps.map((step, index) => (
                        <tr key={index}>
                            <td>{step.step}</td>
                            <td>{step.process}</td>
                            <td>{step.date_init}</td>
                            <td>{step.inputs.item_name}</td>
                            <td>{step.date_end}</td>
                            <td>{step.output.item_name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
         </div>
            
            }  
        </div>
    );
    }