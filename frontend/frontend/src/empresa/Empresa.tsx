import "./style.scss"
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Cartesi } from '../utils/ConnectionService';
import { useParams } from 'react-router-dom';
import Loading from "../loading/Loading";
import Header from "../header/Header";

interface Company {
    id: number;
    address: string;
    tokens: number[];
    cnpj: string;
    corporate_name: string;
    fantasy_name: string;
    open_date: string;
    size: string;
    juridical_nature: string;
    MEI: boolean;
    simple: boolean;
    type: string;
    situation: string;
}

const Empresa = () => {
    const [company, setCompany] = useState<Company>();
    const [isOpen, setIsOpen] = useState(false);
    const { address } = useParams<{ address: string }>();
    const [products, setProducts] = useState<any[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 15;

    // Calcular o índice dos produtos a serem exibidos
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    // exemplo de uso de url params e exemplo de uma url
    // http://localhost:3000/empresa/0x1234567890abcdef1234567890abcdef12345678

    let cartesi: Cartesi | null = null;

    try {
        cartesi = new Cartesi();
    } catch (error) {
        console.error('Error initializing Cartesi:', error);
        toast.error('Error initializing Cartesi');
    }

    useEffect(() => {
        if (address) {
            fetchCompany();
            if(products.length === 0){
                fetchProducts();
            }
            console.log("Products: ", products);
        }
    }, [address, products]);

    const fetchCompany = async () => {
        try {
            if (address) {
                const response = await cartesi?.getCompanyData(address);
                const company: Company = response ? response : null;
                setCompany(company);
            }
        } catch (error) {
            console.error("Failed to fetch company:", error);
            setCompany(undefined);
        }
    }

    const fetchProducts = async () => {
        try{
            if(address){
                const response = await cartesi?.getProducts(address);
                if(response){
                    setProducts(response);
                }else{
                    setProducts([]);
                }
            }
        }catch(error){
            console.error("Failed to fetch products:", error);
        }
    }

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    }

    return (
        <div className="empresa">
            <Header />
            {company == undefined || products == undefined && <Loading />}
            <ToastContainer />
            <h1>Empresa</h1>
            {company && (
                <div className="empresa-container">
                    <h2 className="empresa-title" onClick={toggleAccordion}>
                    {">"}{company.fantasy_name}
                    </h2>
                    {isOpen && (
                        <div className="empresa-details">
                            <p>Data de Abertura: {company.open_date}</p>
                            <p>Porte: {company.size}</p>
                            <p>Natureza Jurídica: {company.juridical_nature}</p>
                            <p>MEI: {company.MEI ? "Sim" : "Não"}</p>
                            <p>Simples: {company.simple ? "Sim" : "Não"}</p>
                            <p>Tipo: {company.type}</p>
                            <p>Situação: {company.situation}</p>
                        </div>
                    )}
                    <div className="products">
                {currentProducts.map((product, index) => (
                    <div key={index} className="product">
                        <a href={"/productions/"+address+"/"+product.id}>{product.name}</a>
                        
                    </div>
                ))}
            </div>
            <div className="pagination">
                {Array.from({ length: Math.ceil(products.length / productsPerPage) }, (_, index) => (
                    <button key={index} onClick={() => paginate(index + 1)}>
                        {index + 1}
                    </button>
                ))}
            </div>
                </div>
            )}
        </div>
    );
}

export default Empresa;