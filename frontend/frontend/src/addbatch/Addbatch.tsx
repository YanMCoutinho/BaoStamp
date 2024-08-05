import './style.scss';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ProductionStep {
    name: string;
    initial_date: string;
    final_date: string;
    farmer?: string;
    community?: string;
    municipality?: string;
    material?: string;
    weight_kg?: number;
    comments?: string;
    avarage_farm_area_ha?: number;
    ref_doc_link?: string;
    industry?: string;
    team_name?: string;
    designer?: string;
    doc_link?: string;
}

interface Batch {
    steps: ProductionStep[];
    n_skus: number;
}

export default function AddBatch() {
    const navigate = useNavigate();
    const [steps, setSteps] = useState<ProductionStep[]>([]);
    const [n_skus, setNSKUs] = useState<number>(0);
    const id = useParams()

    const handleAddStep:any = () => {
        if (steps.length < 3) {
            setSteps([...steps, {
                name: '',
                initial_date: '',
                final_date: ''
            }]);
        } else {
            toast('Maximum of 3 production steps can be added.');
        }
    };

    const handleInputChange = (index: number, field: keyof ProductionStep, value: any) => {
        const newSteps = steps.map((step, i) => {
            if (i === index) {
                return { ...step, [field]: value };
            }
            return step;
        });
        console.log(newSteps);
        setSteps(newSteps);
    };

    const handleContinue = () => {
        const batch: Batch = {
            steps,
            n_skus
        };
        navigate('/review-production', { state: { batch, id } });
    };

    return (
        <div className='background'>
            <div className="add-batch-container">
                <h2>Add Production Steps</h2>
                <p>Welcome to our batch registration system. Here you can efficiently document each step of your product's journey, ensuring transparency and traceability. This process not only enhances your brand's credibility but also aligns with modern sustainability practices.</p>

                {steps.map((step, index) => (
                    <div key={index} className="production-step">
                        <h3>Step {index + 1}</h3>
                        <div className="form-group">
                            <label htmlFor={`name-${index}`}>Step Name:</label>
                            <select
                                id={`name-${index}`}
                                value={step.name}
                                onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                                >
                                <option value="">Select a step</option>
                                <option value="Harvest">Harvest</option>
                                <option value="Industry">Industry</option>
                                <option value="Design">Design</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor={`initial-date-${index}`}>Initial Date:</label>
                            <input
                                type="date"
                                id={`initial-date-${index}`}
                                value={step.initial_date}
                                onChange={(e) => handleInputChange(index, 'initial_date', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor={`final-date-${index}`}>Final Date:</label>
                            <input
                                type="date"
                                id={`final-date-${index}`}
                                value={step.final_date}
                                onChange={(e) => handleInputChange(index, 'final_date', e.target.value)}
                            />
                        </div>
                        {step.name === 'Harvest' && (
                            <>
                                <div className="form-group">
                                    <label htmlFor={`farmer-${index}`}>Farmer:</label>
                                    <input
                                        type="text"
                                        id={`farmer-${index}`}
                                        placeholder="Enter the farmer's name"
                                        value={step.farmer}
                                        onChange={(e) => handleInputChange(index, 'farmer', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`community-${index}`}>Community:</label>
                                    <input
                                        type="text"
                                        id={`community-${index}`}
                                        placeholder="Enter the community name"
                                        value={step.community}
                                        onChange={(e) => handleInputChange(index, 'community', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`municipality-${index}`}>Municipality:</label>
                                    <input
                                        type="text"
                                        id={`municipality-${index}`}
                                        placeholder="Enter the municipality name"
                                        value={step.municipality}
                                        onChange={(e) => handleInputChange(index, 'municipality', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`material-${index}`}>Material:</label>
                                    <input
                                        type="text"
                                        id={`material-${index}`}
                                        placeholder="Enter the material"
                                        value={step.material}
                                        onChange={(e) => handleInputChange(index, 'material', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`weight-${index}`}>Weight (kg):</label>
                                    <input
                                        type="number"
                                        id={`weight-${index}`}
                                        placeholder="Enter the weight in kilograms"
                                        value={step.weight_kg}
                                        onChange={(e) => handleInputChange(index, 'weight_kg', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`comments-${index}`}>Comments:</label>
                                    <textarea
                                        id={`comments-${index}`}
                                        placeholder="Enter any additional comments"
                                        value={step.comments}
                                        onChange={(e) => handleInputChange(index, 'comments', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`farm-area-${index}`}>Average Farm Area (ha):</label>
                                    <input
                                        type="number"
                                        id={`farm-area-${index}`}
                                        placeholder="Enter the average farm area in hectares"
                                        value={step.avarage_farm_area_ha}
                                        onChange={(e) => handleInputChange(index, 'avarage_farm_area_ha', e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                        {step.name === 'Industry' && (
                            <>
                                <div className="form-group">
                                    <label htmlFor={`ref-doc-link-${index}`}>Reference Document Link:</label>
                                    <input
                                        type="text"
                                        id={`ref-doc-link-${index}`}
                                        placeholder="Enter the reference document link"
                                        value={step.ref_doc_link}
                                        onChange={(e) => handleInputChange(index, 'ref_doc_link', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`industry-${index}`}>Industry:</label>
                                    <input
                                        type="text"
                                        id={`industry-${index}`}
                                        placeholder="Enter the industry name"
                                        value={step.industry}
                                        onChange={(e) => handleInputChange(index, 'industry', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`comments-${index}`}>Comments:</label>
                                    <textarea
                                        id={`comments-${index}`}
                                        placeholder="Enter any additional comments"
                                        value={step.comments}
                                        onChange={(e) => handleInputChange(index, 'comments', e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                        {step.name === 'Design' && (
                            <>
                                <div className="form-group">
                                    <label htmlFor={`team-name-${index}`}>Team Name:</label>
                                    <input
                                        type="text"
                                        id={`team-name-${index}`}
                                        placeholder="Enter the team name"
                                        value={step.team_name}
                                        onChange={(e) => handleInputChange(index, 'team_name', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`designer-${index}`}>Designer:</label>
                                    <input
                                        type="text"
                                        id={`designer-${index}`}
                                        placeholder="Enter the designer's name"
                                        value={step.designer}
                                        onChange={(e) => handleInputChange(index, 'designer', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`doc-link-${index}`}>Document Link:</label>
                                    <input
                                        type="text"
                                        id={`doc-link-${index}`}
                                        placeholder="Enter the document link"
                                        value={step.doc_link}
                                        onChange={(e) => handleInputChange(index, 'doc_link', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`comments-${index}`}>Comments:</label>
                                    <textarea
                                        id={`comments-${index}`}
                                        placeholder="Enter any additional comments"
                                        value={step.comments}
                                        onChange={(e) => handleInputChange(index, 'comments', e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                ))}
                <div className="batch-details">
                    <div className="form-group">
                        <label htmlFor="n-skus">Number of SKUs:</label>
                        <input
                            type="number"
                            id="n-skus"
                            placeholder="Enter the number of SKUs"
                            value={n_skus.toString()}
                            onChange={(e) => setNSKUs(parseInt(e.target.value) || 0)}
                        />
                    </div>
                </div>
                <div className="buttons_final">
                    <button onClick={handleAddStep}>Add Step</button>
                    {steps.length > 0 && (
                        <button onClick={handleContinue} className="continue">Continue</button>
                    )}
                </div>
                <div className="final-notes">
                    <p>After submitting the production details, our system will review the information. If approved, NFTs representing each SKU will be issued along with a BaoStamp certification, enhancing your product's transparency and trustworthiness.</p>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
