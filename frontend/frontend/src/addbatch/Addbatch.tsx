import './style.scss';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProductionStep {
    id: number;
    stage: string;
    continent: string;
    inputProducts: string;
    outputProducts: string;
    startDate: string;
    endDate: string;
    briefDescription: string;
    waterUsage: string;
    energyUsage: string;
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
                continent: '',
                inputProducts: '',
                outputProducts: '',
                startDate: '',
                endDate: '',
                briefDescription: '',
                waterUsage: '',
                energyUsage: ''
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
            <p>Welcome to our batch registration system. Here you can efficiently document each step of your product's journey, ensuring transparency and traceability. This process not only enhances your brand's credibility but also aligns with modern sustainability practices.</p>

            {productionSteps.map((step, index) => (
                <div key={step.id} className="production-step">
                    <h3>Step {step.id}</h3>
                    <div className="form-group">
                        <label htmlFor={`stage-${step.id}`}>Stage Name:</label>
                        <select
                            id={`stage-${step.id}`}
                            value={step.stage}
                            onChange={(e) => handleInputChange(index, 'stage', e.target.value)}
                        >
                            <option value="">Select the stage of production</option>
                            <option value="Harvest">Harvest</option>
                            <option value="Processing">Processing</option>
                            <option value="Spinning">Spinning</option>
                            <option value="Weaving">Weaving</option>
                            <option value="Dyeing">Dyeing</option>
                            <option value="Cutting and Sewing">Cutting and Sewing</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor={`continent-${step.id}`}>Continent of Production:</label>
                        <select
                            id={`continent-${step.id}`}
                            value={step.continent}
                            onChange={(e) => handleInputChange(index, 'continent', e.target.value)}
                        >
                            <option value="">Select the continent where production occurs</option>
                            <option value="America">America</option>
                            <option value="Africa">Africa</option>
                            <option value="Europe">Europe</option>
                            <option value="Asia">Asia</option>
                            <option value="Oceania">Oceania</option>
                            <option value="Antarctica">Antarctica</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor={`input-products-${step.id}`}>Input Products:</label>
                        <input
                            type="text"
                            id={`input-products-${step.id}`}
                            placeholder="Enter the input products (e.g., Cotton, Polyester)"
                            value={step.inputProducts}
                            onChange={(e) => handleInputChange(index, 'inputProducts', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor={`output-products-${step.id}`}>Output Products:</label>
                        <input
                            type="text"
                            id={`output-products-${step.id}`}
                            placeholder="Enter the output products (e.g., Fabric, Yarn)"
                            value={step.outputProducts}
                            onChange={(e) => handleInputChange(index, 'outputProducts', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor={`start-date-${step.id}`}>Start Date:</label>
                        <input
                            type="date"
                            id={`start-date-${step.id}`}
                            value={step.startDate}
                            onChange={(e) => handleInputChange(index, 'startDate', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor={`end-date-${step.id}`}>End Date:</label>
                        <input
                            type="date"
                            id={`end-date-${step.id}`}
                            value={step.endDate}
                            onChange={(e) => handleInputChange(index, 'endDate', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor={`brief-description-${step.id}`}>Brief Description of the Process:</label>
                        <textarea
                            id={`brief-description-${step.id}`}
                            placeholder="Provide a brief description of the process"
                            value={step.briefDescription}
                            onChange={(e) => handleInputChange(index, 'briefDescription', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor={`water-usage-${step.id}`}>Water Usage (liters):</label>
                        <input
                            type="number"
                            id={`water-usage-${step.id}`}
                            placeholder="Enter the amount of water used"
                            value={step.waterUsage}
                            onChange={(e) => handleInputChange(index, 'waterUsage', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor={`energy-usage-${step.id}`}>Energy Usage (kWh):</label>
                        <input
                            type="number"
                            id={`energy-usage-${step.id}`}
                            placeholder="Enter the amount of energy used"
                            value={step.energyUsage}
                            onChange={(e) => handleInputChange(index, 'energyUsage', e.target.value)}
                        />
                    </div>
                </div>
            ))}
            <div className="batch-details">
                <div className="form-group">
                    <label htmlFor="number-of-skus">Number of SKUs:</label>
                    <input
                        type="number"
                        id="number-of-skus"
                        placeholder="Enter the number of SKUs"
                        value={numberOfSKUs.toString()}
                        onChange={(e) => setNumberOfSKUs(parseInt(e.target.value) || 0)}
                    />
                </div>
            </div>
            <div className="buttons_final">
                <button onClick={handleAddStep}>Add Step</button>
                {productionSteps.length > 0 && (
                    <button onClick={handleContinue} className="continue">Continue</button>
                )}
            </div>
            <div className="final-notes">
                <p>After submitting the production details, our system will review the information. If approved, NFTs representing each SKU will be issued along with a BaoStamp certification, enhancing your product's transparency and trustworthiness.</p>
            </div>
        </div>
    );
}
