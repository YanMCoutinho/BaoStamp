import './style.scss';
import IllustrationImg from '../assets/world_3d.png';
import Header from '../header/Header';

export default function Intro() {
    return (
        <div>
            < Header />
            <div className="intro-container">
                <div className="content-wrapper">
                    <div className="text-section">
                        <h1>Welcome to Y-Open Data</h1>
                        <p>Ensure the authenticity of your favorite brands with blockchain technology. Trace the entire production chain and validate your fashion purchases.</p>
                        <div className="button-section">
                            <button onClick={() => window.location.href = '/home'}>About</button>
                            <button onClick={() => window.location.href = '/setperfil'}>Join The Revolution</button>
                        </div>
                    </div>
                    <div className="image-section">
                        <img src={IllustrationImg} alt="Illustration" className="floating-image" />
                    </div>
                </div>
            </div>
        </div>
    );
}
