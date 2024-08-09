import './style.scss';
import React, { useState, useEffect } from 'react';
import { Cartesi } from '../utils/ConnectionService';
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import Loading from '../loading/Loading';
import Header from '../header/Header';
import Voucher from '../voucher/Voucher';



export default function SKU() {
  const { address, product_id, production_id } = useParams();

  let cartesi: Cartesi | null = null;

  try {
    cartesi = new Cartesi();
  } catch (error) {
    console.error("Error initializing Cartesi:", error);
    toast.error('Error initializing Cartesi');
  }
  
  const [product, setProduct] = useState({
    name: "name",
    description: "description",
    input_index: 0,
    steps: [],
    n_skus: 0
  });

  const [userAddress, setUserAddress] = useState("0x0");

  const [openDetails, setOpenDetails] = useState<number | null>(null);

  const executeVoucher = async () => {
    const response = await cartesi?.executeVoucher(0, product.input_index);

    if (response && response.error) {
      toast.error('Erro ao tentar executar o voucher');
    } else {
      toast.success('Voucher executado com sucesso');
    }
  }

  useEffect(() => {
    const getProduct = async () => {
      try {
        let product_string = await cartesi?.getInspectClient(`products/${address}/${product_id}`);
        let base_product = { name: "name", description: "description" };
        if (typeof product_string === 'string') {
          console.log('product is a string');
          try {
            product_string = product_string.replace(/'/g, '"');
            base_product = JSON.parse(product_string);
          } catch (error) {
            console.error("Error parsing product:", error);
            toast.error('Erro ao tentar ler os dados da blockchain');
            return;
          }
        }

        let production_string = await cartesi?.getInspectClient(`production/${address}/${product_id}/${production_id}`);
        let production = { steps: [], n_skus: 0, input_index: 0 };
        if (typeof production_string === 'string') {
          console.log('production is a string');
          try {
            production_string = production_string.replace(/'/g, '"');
            production = JSON.parse(production_string);
            console.log(production);
          } catch (error) {
            console.error("Error parsing production:", error);
            toast.error('Erro ao tentar ler os dados da blockchain');
            return;
          }
        }

        const requestedProduct = {
          "name": base_product.name,
          "description": base_product.description,
          "steps": production.steps,
          "n_skus": production.n_skus,
          "input_index": production.input_index
        }

        setProduct(requestedProduct);
        console.log(requestedProduct);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error('Error fetching products');
      }

    };

    const getUserAddress = async () => {
      try{
        const _address = String(await cartesi?.signer?.getAddress()).trim().toLowerCase();
        setUserAddress(_address);
      }catch(error){
        console.log("You are not connected to a wallet");
      }
    }
    getUserAddress();
    getProduct();
  }, []);

  return (
    <div className='background'>
      <Header />
      <div className="sku-container">
        <h1>Visualize a Product</h1>
        {
          product.name == "name" ?

            <Loading />

            :

            <div className="sku">
              <div className="sku-header">
                <h2>{product.name}</h2>
                <p>{product.description}</p>
              </div>
              <div>
                {
                  product.steps.map((step: any, index) => {
                    return (
                      <details key={index} open={openDetails === index} onClick={() => setOpenDetails(index)}>
                        <summary className="summary_sku">{step.name}</summary>
                        <table className="step">
                          <thead>
                            <tr>
                              <th colSpan={2}>{step.name}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {step.name === "Harvest" && (
                              <>
                                <tr>
                                  <td>Farmer:</td>
                                  <td>{step.farmer}</td>
                                </tr>
                                <tr>
                                  <td>Community:</td>
                                  <td>{step.community}</td>
                                </tr>
                                <tr>
                                  <td>Municipality:</td>
                                  <td>{step.municipality}</td>
                                </tr>
                                <tr>
                                  <td>Material:</td>
                                  <td>{step.material}</td>
                                </tr>
                                <tr>
                                  <td>Weight:</td>
                                  <td>{step.weight_kg} kg</td>
                                </tr>
                                <tr>
                                  <td>Comments:</td>
                                  <td>{step.comments}</td>
                                </tr>
                                <tr>
                                  <td>Average farm area:</td>
                                  <td>{step.average_farm_area_ha} ha</td>
                                </tr>
                              </>
                            )}
                            {step.name === "Industry" && (
                              <>
                                <tr>
                                  <td>Industry:</td>
                                  <td>{step.industry}</td>
                                </tr>
                                <tr>
                                  <td>Comments:</td>
                                  <td>{step.comments}</td>
                                </tr>
                                <tr>
                                  <td>Reference document:</td>
                                  <td>
                                    <a href={step.ref_doc_link} target="_blank" rel="noopener noreferrer">
                                      Link to reference document
                                    </a>
                                  </td>
                                </tr>
                              </>
                            )}
                            {step.name === "Design" && (
                              <>
                                <tr>
                                  <td>Team name:</td>
                                  <td>{step.team_name}</td>
                                </tr>
                                <tr>
                                  <td>Designer:</td>
                                  <td>{step.designer}</td>
                                </tr>
                                <tr>
                                  <td>Comments:</td>
                                  <td>{step.comments}</td>
                                </tr>
                                <tr>
                                  <td>Design document:</td>
                                  <td>
                                    <a href={step.doc_link} target="_blank" rel="noopener noreferrer">
                                      Link to design document
                                    </a>
                                  </td>
                                </tr>
                              </>
                            )}
                          </tbody>
                        </table>
                      </details>
                    );
                  })

                }
              </div>
            </div>


        }

        <a href={`http://localhost:8080/explorer/inputs?query=${product.input_index}`}>
          <button className="button">Confira a transação na blockchain</button>
        </a>
        { 
          String(address).trim().toLowerCase() == String(userAddress).trim().toLowerCase() ? 
          <button className="button" onClick={executeVoucher}>Crie a NFT</button> : 
          <></>
        }
      </div>
      <ToastContainer />
    </div>
  );
}
