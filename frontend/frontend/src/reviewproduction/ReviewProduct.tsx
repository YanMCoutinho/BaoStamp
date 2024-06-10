import { useLocation, useNavigate } from 'react-router-dom';
import './style.scss'

const ReviewProduction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { productionSteps, numberOfSKUs } = location.state;

  // Enviar solicitação de verificação backend
  const handleVerificationRequest = () => {
    console.log("Requesting verification and issuance of the seal:", { productionSteps, numberOfSKUs });
    alert("Verification requested!");
    navigate('/');
  };

  return (
    <div className="review-production-container">
      <h2>Review Production Steps</h2>
      {productionSteps.map((step: any, index: number) => (
        <div key={index} className="production-step">
          <p>Stage {step.id}: {step.stage}</p>
          <p>Process: {step.process}</p>
          <p>Continent: {step.continent}</p>
          <p>Input Products: {step.inputProducts}</p>
          <p>Output Products: {step.outputProducts}</p>
          <p>Start Date: {step.startDate}</p>
          <p>End Date: {step.endDate}</p>
          <p>Brief Description of the Process: {step.briefDescription}</p>
        </div>
      ))}
      <div className="sku-total">
        Total Number of SKUs: {numberOfSKUs}
      </div>
      <button onClick={handleVerificationRequest} className="verification-button">Finish and Request Verification</button>
    </div>
  );
};

export default ReviewProduction;
