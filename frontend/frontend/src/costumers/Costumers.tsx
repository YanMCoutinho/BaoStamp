import React, { useEffect, useState } from 'react';
import './style.scss';
import { Cartesi } from '../utils/ConnectionService';
import { ToastContainer, toast } from 'react-toastify';
import Header from '../header/Header';

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

const Customers: React.FC = () => {
    
    const [companies, setCompanies] = useState<Company[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    let cartesi: Cartesi | null = null;

    try {
        cartesi = new Cartesi();
    } catch (error) {
        console.error('Error initializing Cartesi:', error);
        toast.error('Error initializing Cartesi');
    }

    const seeCompanies = () => {
        console.log('Companies:', companies);
        companies.forEach(company => {
            console.log(company.corporate_name);
        });
    }

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await cartesi?.getCompaniesData();
            const companies: Company[] = response ? response.map((item: any) => item.payload) : [];
            setCompanies(companies);
            setTotalPages(Math.ceil(companies.length / 10)); // Calculate total pages
        } catch (error) {
            console.error("Failed to fetch companies:", error);
            setCompanies([]);
            setTotalPages(0);
        }
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    }

    const renderCompanies = () => {
        const startIndex = (currentPage - 1) * 10;
        const endIndex = startIndex + 10;
        const companiesToRender = companies.slice(startIndex, endIndex);

        return companiesToRender.map((company, index) => (
            <tr key={index}>
                <td>{company.fantasy_name}</td>
                <td>
                    <a href={`/empresa/${company.address}`}>View Details</a>
                </td>
            </tr>
        ));
    };

    return (
        <div>
            <Header />
            <table>
                <thead>
                    <tr>
                        <th>Company</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>{renderCompanies()}</tbody>
            </table>
            <div>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button key={index} onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                    </button>
                ))}
            </div>
            <ToastContainer />
        </div>
    );
};

export default Customers;
