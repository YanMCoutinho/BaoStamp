import './style.scss';
import IllustrationImg from '../assets/world_3d.png';

export default function Intro() {
    return (
        <div className="intro-container">
            <div className="content-wrapper">
                <div className="text-section">
                    <h1>Welcome to BaoStamp</h1>
                    <p>Ensure the authenticity of your favorite brands with blockchain technology. Trace the entire production chain and validate your fashion purchases.</p>
                    <div className="button-section">
                        <button onClick={() => window.location.href='/home'}>Know more about BaoStamp</button>
                        <button onClick={() => window.location.href='/setperfil'}>Enter and Change the World</button>
                    </div>
                </div>
                <div className="image-section">
                    <img src={IllustrationImg} alt="Illustration" className="floating-image" />
                </div>
            </div>
        </div>
    );
}
