import { useLocation, useNavigate } from 'react-router-dom';
import './style.scss';
import { useWallet } from "../WalletContext"

const ReviewProduction = () => {
  const wallet = useWallet();
  const location = useLocation();
  const navigate = useNavigate();
  const { productionSteps, numberOfSKUs, id } = location.state;

  // Enviar solicitação de verificação backend
  const handleVerificationRequest = () => {
    console.log("Requesting verification and issuance of the seal:", { productionSteps, numberOfSKUs, id });
    //request json
    const reqJson = {
      id:{
        steps:productionSteps,
        n_skus:numberOfSKUs
      }
    }
    console.log(wallet)
    console.log(reqJson)

  };

  return (
    <div className="background">
      <div className="review-production-container">
        <h2>Review Your Production Steps</h2>
        <p className="intro-text">Welcome to the review section! Here, you can double-check the details of each production step to ensure accuracy and completeness. This is your chance to make sure everything is perfect before requesting verification and issuing the seal of quality.</p>
        <p className="intro-text">Each production step listed below shows the essential information about the stage, including the resources used and the geographical location. Ensure that all details are accurate to reflect the sustainability and efficiency of your production process.</p>
        {productionSteps.map((step: any, index: number) => (
          <div key={index} className="production-step">
            <h3>Stage {step.id}: {step.stage}</h3>
            <p><strong>Continent:</strong> {step.continent}</p>
            <p><strong>Input Products:</strong> {step.inputProducts}</p>
            <p><strong>Output Products:</strong> {step.outputProducts}</p>
            <p><strong>Start Date:</strong> {step.startDate}</p>
            <p><strong>End Date:</strong> {step.endDate}</p>
            <p><strong>Brief Description of the Process:</strong> {step.briefDescription}</p>
            <p><strong>Water Usage:</strong> {step.waterUsage} liters</p>
            <p><strong>Energy Usage:</strong> {step.energyUsage} kWh</p>
          </div>
        ))}
        <div className="sku-total">
          <p><strong>Total Number of SKUs:</strong> {numberOfSKUs}</p>
        </div>
        <p className="final-text">Once you are satisfied with the information provided, click the button below to finalize and request verification. This step is crucial for ensuring the transparency and traceability of your production process.</p>
        <button onClick={handleVerificationRequest} className="verification-button">Finish and Request Verification</button>
      </div>
    </div>
  );
};

export default ReviewProduction;
