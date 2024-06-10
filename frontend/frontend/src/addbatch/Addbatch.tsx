
import './style.scss';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProductionStep {
    id: number;
    stage: string;
    process: string;
    continent: string;
    inputProducts: string;
    outputProducts: string;
    startDate: string;
    endDate: string;
    briefDescription: string;
}

interface Batch {
    productionSteps: ProductionStep[];
    numberOfSKUs: number;
}

export default function AddBatch() {
    const navigate = useNavigate();
    const [productionSteps, setProductionSteps] = useState<ProductionStep[]>([]);
    const [numberOfSKUs, setNumberOfSKUs] = useState<number>(0);

    const handleAddStep = () => {
        if (productionSteps.length < 6) {
            setProductionSteps([...productionSteps, {
                id: productionSteps.length + 1,
                stage: '',
                process: '',
                continent: '',
                inputProducts: '',
                outputProducts: '',
                startDate: '',
                endDate: '',
                briefDescription: ''
            }]);
        } else {
            alert('Maximum of 6 production steps can be added.');
        }
    };

    const handleInputChange = (index: number, field: keyof ProductionStep, value: string) => {
        const newSteps = productionSteps.map((step, i) => {
            if (i === index) {
                return { ...step, [field]: value };
            }
            return step;
        });
        setProductionSteps(newSteps);
    };

    const handleContinue = () => {
        navigate('/review-production', { state: { productionSteps, numberOfSKUs } });
    };

    return (
        <div className="add-batch-container">
            <h2>Add Production Steps</h2>
            {productionSteps.map((step, index) => (
                <div key={step.id} className="production-step">
                    <h3>Step {step.id}: {step.stage}</h3>
                    <p>Stage Name:</p>
                    <select
                        value={step.stage}
                        onChange={(e) => handleInputChange(index, 'stage', e.target.value)}
                    >
                        <option value="">Select Stage Name</option>
                        <option value="Harvest">Harvest</option>
                        <option value="Processing">Processing</option>
                        <option value="Spinning">Spinning</option>
                        <option value="Weaving">Weaving</option>
                        <option value="Dyeing">Dyeing</option>
                        <option value="Cutting and Sewing">Cutting and Sewing</option>
                    </select>
                    <p>Process:</p>
                    <input
                        type="text"
                        placeholder="Process"
                        value={step.process}
                        onChange={(e) => handleInputChange(index, 'process', e.target.value)}
                    />
                    <p>Continent:</p>
                    <select
                        value={step.continent}
                        onChange={(e) => handleInputChange(index, 'continent', e.target.value)}
                    >
                        <option value="">Select Continent</option>
                        <option value="America">America</option>
                        <option value="Africa">Africa</option>
                        <option value="Europe">Europe</option>
                        <option value="Asia">Asia</option>
                        <option value="Oceania">Oceania</option>
                        <option value="Antarctica">Antarctica</option>
                    </select>
                    <p>Input Products:</p>
                    <input
                        type="text"
                        placeholder="e.g., Cotton, Polyester"
                        value={step.inputProducts}
                        onChange={(e) => handleInputChange(index, 'inputProducts', e.target.value)}
                    />
                    <p>Output Products:</p>
                    <input
                        type="text"
                        placeholder="e.g., Cotton, Polyester"
                        value={step.outputProducts}
                        onChange={(e) => handleInputChange(index, 'outputProducts', e.target.value)}
                    />
                    <p>Start Date:</p>
                    <input
                        type="date"
                        value={step.startDate}
                        onChange={(e) => handleInputChange(index, 'startDate', e.target.value)}
                    />
                    <p>End Date:</p>
                    <input
                        type="date"
                        value={step.endDate}
                        onChange={(e) => handleInputChange(index, 'endDate', e.target.value)}
                    />
                    <p>Brief Description of the Process:</p>
                    <textarea
                        placeholder="Brief Description of the Process"
                        value={step.briefDescription}
                        onChange={(e) => handleInputChange(index, 'briefDescription', e.target.value)}
                    />
                </div>
            ))}
            <div className="batch-details">
                <p>Number of SKUs:</p>
                <input
                    type="number"
                    placeholder="Number of SKUs"
                    value={numberOfSKUs.toString()}
                    onChange={(e) => setNumberOfSKUs(parseInt(e.target.value) || 0)}
                />
            </div>
            <div className="buttons_final">
                <button onClick={handleAddStep}>Add Step</button>
                {productionSteps.length > 0 && (
                    <button onClick={handleContinue} className="continue">Continue</button>
                )}
            </div>
        </div>
    );
}
