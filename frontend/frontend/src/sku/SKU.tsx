import './style.scss';
import React, {useState, useEffect} from 'react';
import { Cartesi } from '../ConnectionService';
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
const cartesi = new Cartesi();

export default function SKU() {
    const { address, product_id, production_id } = useParams();

    const [product, setProduct] = useState(
        {
            "name": "Nike Dri-FIT Uniform Shirts",
            "description": "Elevate your daily workout with the Nike Dri-FIT T-Shirt. The soft, stretchy fabric wicks sweat away from your skin to help you stay focused and perform at your best. This product is made with 100% recycled polyester fabric.",
            "steps": [
                {
                "id": 1,
                "stage": "Raw Material Collection",
                "continent": "america",
                "inputProducts": 'polyester',
                "outputProducts":  "Cotton, polyester, nylon, wool, microfiber, tencel, pnen, synthetic blend",
                "startDate": "2023-01-01",
                "endDate": "2023-07-01",
                "briefDescription": "description"
                },
                {
                    "id": 1,
                    "stage": "Raw Material Collection",
                    "continent": "america",
                    "inputProducts": 'polyester',
                    "outputProducts":  "Cotton, polyester, nylon, wool, microfiber, tencel, pnen, synthetic blend",
                    "startDate": "2023-01-01",
                    "endDate": "2023-07-01",
                    "briefDescription": "description"
                }
            ],
            "n_skus": 123
        }
    );


    const retunOfTheProduct = {
        "name": "Searching...",
        "description": "Searching for your product inside the blockchain",
        "steps": [],
        "n_skus": 0
      }

    useEffect(() => {
        const getProduct = async () => {
            try {
              let product_string = await cartesi.getInspectClient(`products/${address}/${product_id}`);
              let base_product = {name: "name", description: "description"};
              if (typeof product_string === 'string') {
                console.log('product is a string');
                try{
                  product_string = product_string.replace(/'/g, '"');
                  base_product = JSON.parse(product_string);
                } catch(error) {
                  console.error("Error parsing product:", error);
                  toast.error('Erro ao tentar ler os dados da blockchain');
                  return;
                }
              }
                
                let production_string = await cartesi.getInspectClient(`productions/${address}/${product_id}/${production_id}`);
                let production = {steps: [], n_skus: 0};
                if (typeof production_string === 'string') {
                    console.log('production is a string');
                    try{
                        production_string = production_string.replace(/'/g, '"');
                        production = JSON.parse(production_string);
                    } catch(error) {
                        console.error("Error parsing production:", error);
                        toast.error('Erro ao tentar ler os dados da blockchain');
                        return;
                    }
                }

                const requestedProduct = {
                    "name": base_product.name,
                    "description": base_product.description,
                    "steps": production.steps,
                    "n_skus": production.n_skus
                }

              setProduct(requestedProduct);
            } catch (error) {
              console.error("Error fetching products:", error);
              toast.error('Error fetching products');
            }
            
          };
        getProduct();
        
    } , []);

     
    return (
        <div className='background'>
            <div className="sku-container">
                <h1>Visualize a Product</h1>
                {
                product.name == "name" ?
                
                <h1>nada</h1>

                :

                <div className="sku">
                <div className="sku-header">
                    <h2>{product.name}</h2>
                    <p>{product.description}</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Stage</th>
                            <th>Process</th>
                            <th>Continent</th>
                            <th>Start Date</th>
                            <th>Input Material</th>
                            <th>Final Date</th>
                            <th>Output Material</th>
                        </tr>
                    </thead>
                    <tbody>
                        {product.steps.map((step, index) => (
                            <tr key={index}>
                                <td>{step.id}</td>
                                <td>{step.stage}</td>
                                <td>{step.continent}</td>
                                <td>{step.startDate}</td>
                                <td>{step.inputProducts}</td>
                                <td>{step.endDate}</td>
                                <td>{step.outputProducts}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
                
                }  
            </div>
            <ToastContainer />
        </div>
    );
    }