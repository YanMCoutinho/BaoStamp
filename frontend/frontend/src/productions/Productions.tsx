import React, {useEffect, useState} from "react";
import { Cartesi } from "../utils/ConnectionService";
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from "react-router-dom";
import Header from "../header/Header";
import "./style.scss";

interface Production {
    //id, input_index, product_id, token_id, steps, n_skus
    id: string;
    input_index: string;
    product_id: string;
    token_id: string;
    steps: Array<{ initial_date: string, final_date: string }>;
    n_skus: number;
}



const Productions = () => {

    const [productions, setProductions] = useState([]);

    const { address, product_id } = useParams<{ address: string, product_id: string }>();
    let cartesi: Cartesi | null = null;
    try {
        cartesi = new Cartesi();
    }catch (error) {
        console.error('Error initializing Cartesi:', error);
        toast.error('Error initializing Cartesi');
    }

    useEffect(() => {
        console.log("Fetching productions");
        if(productions.length === 0){
            fetchProductions();
        }else{
            console.log("Productions already fetched");
            console.log("prods: ",productions);
        }
    }, [productions]);

    const fetchProductions = async () => {
        if(address !== undefined && product_id !== undefined){
            try {
                const response = await cartesi?.getProduct(address, product_id);
                if(response){
                    setProductions(response);
                }else{
                    console.log("Productions does not exist");
                }
            }catch (error) {
                console.error("Failed to fetch productions:", error);
            }
        }
    }

    return (
        <div>
            <Header />
            <h1 style={{padding:"80px"}}>Productions</h1>
            <div>
            {productions.map((production: Production) => {
    const initialDate = production.steps.reduce((minDate, step) => {
        return step.initial_date < minDate ? step.initial_date : minDate;
    }, production.steps[0].initial_date);

    const finalDate = production.steps.reduce((maxDate, step) => {
        return step.final_date > maxDate ? step.final_date : maxDate;
    }, production.steps[0].final_date);

    return (
        <div className="production-card">

            <details className="production-detail" key={production.id}>
                <summary>Production ID: {production.token_id}</summary>
                <p>Input Index: {production.input_index}</p>
                <p>Product ID: {production.product_id}</p>
                <p>Token ID: {production.token_id}</p>
                <p>Initial Data: {initialDate}</p>
                <p>Final Data: {finalDate}</p>
                <p>Number of SKUs: {production.n_skus}</p>
                <button className="button" onClick={() => window.location.href=`/sku/${address}/${product_id}/${production.id}`}>View SKUs trace</button>
            </details>
        </div>
    );
})}
            </div>
            <ToastContainer />
        </div>
    );
}

export default Productions;