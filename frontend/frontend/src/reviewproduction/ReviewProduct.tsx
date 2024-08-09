import { useLocation, useNavigate } from 'react-router-dom';
import './style.scss';
import { Cartesi } from '../utils/ConnectionService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import Header from '../header/Header';

const ReviewProduction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { batch, id } = location.state;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);

  let cartesi: Cartesi | null = null;

  let address = async () =>{
    let address = await cartesi?.signer?.getAddress();
    if(address){
      setUserAddress(address);
    }
    return address;
  }

  try {
    cartesi = new Cartesi();
    address();
  } catch (error) {
    console.error("Error initializing Cartesi:", error);
    toast.error('Error initializing Cartesi');
  }

  // Enviar solicitação de verificação backend
  const handleVerificationRequest = async () => {
    console.log("Requesting verification and issuance of the seal:", { id, batch });
    const reqJson = {
      type: 1,
      data: {
        id: id["id"],
        steps: batch["steps"],
        n_skus: batch["n_skus"],
      }
    };


    const reqJsonStr = JSON.stringify(reqJson);

    console.log(reqJsonStr);

    const input = await cartesi?.sendInputBox(reqJsonStr);

    if (input) {
      console.log("Input sent");
      toast.success('Batch added successfully');
      setTimeout(() => {
        navigate(`/sku/${userAddress}/0/0`);
      }, 2000);
    } else {
      toast.error('Error adding batch');
    }
  };

  useEffect(() => {
    console.log("ReviewProduction", { batch, id }); 
    
    if (!id) {
      navigate('/company');
    }
    if (!cartesi?.isConnected()) {
      navigate('/company');
    }
  }, []);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="background">
      < Header />
      <h1>Review Production</h1>
      <div className="batch-details">
        <h2>Batch Details</h2>
        <p>ID: {id.id}</p>
        <p>Number of SKUs: {batch.n_skus}</p>
      </div>
      <div className="steps">
        <h2>Steps</h2>
        {batch.steps.map((step: any, index: number) => (
          <div key={index} className="step">
            <div className="accordion-header" onClick={() => toggleAccordion(index)}>
              <h3>{step.name}</h3>
            </div>
            {activeIndex === index && (
              <div className="accordion-content">
                <p>Initial Date: {step.initial_date}</p>
                <p>Final Date: {step.final_date}</p>
                {step.farmer && <p>Farmer: {step.farmer}</p>}
                {step.community && <p>Community: {step.community}</p>}
                {step.municipality && <p>Municipality: {step.municipality}</p>}
                {step.material && <p>Material: {step.material}</p>}
                {step.weight_kg && <p>Weight (kg): {step.weight_kg}</p>}
                {step.comments && <p>Comments: {step.comments}</p>}
                {step.avarage_farm_area_ha && <p>Average Farm Area (ha): {step.avarage_farm_area_ha}</p>}
                {step.ref_doc_link && <p>Document: <a href={step.ref_doc_link} target="_blank" rel="noopener noreferrer">Link</a></p>}
                {step.industry && <p>Industry: {step.industry}</p>}
                {step.designer && <p>Designer: {step.designer}</p>}
                {step.doc_link && <p>Document: <a href={step.doc_link} target="_blank" rel="noopener noreferrer">Link</a></p>}
              </div>
            )}
          </div>
        ))}
      </div>
      <button onClick={handleVerificationRequest}>Request Verification</button>
      <ToastContainer />
    </div>
  );
};

export default ReviewProduction;