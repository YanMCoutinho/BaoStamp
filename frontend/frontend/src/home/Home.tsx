import './style.scss';
import IllustrationImg from '../assets/world_3d.png';

export default function Intro() {
    return (
        <div className="landing-page">
            <section className="hero">
                <h1>Welcome to BaoStamp</h1>
                <h2>An internacional seal of transparency and sustentability</h2>
                <h2>in the textile industry's production chain</h2>
                <div className="image-section">
                    <img src={IllustrationImg} alt="Illustration" className="floating-image" />
                </div>
                <button onClick={() => window.location.href="/setperfil"}>Enter and Change the World</button>
            </section>
            <section className="features">
                <h2>Welcome to the Future of Sustainable Fashion</h2>
                <p>BaoStamp offers an unparalleled transparency and sustainability seal for the textile industry, utilizing advanced blockchain, tokenization, and artificial intelligence (AI) technologies. Our revolutionary solution ensures that every step of the production chain is recorded securely, immutably, and accessibly, providing confidence and peace of mind to consumers while strengthening your brand's reputation.</p>
                <h2>How BaoStamp Works</h2>
                <div className="feature-list">
                    <div className="feature">
                        <h3>Unique ID for Each Product</h3>
                        <p>Every item gets a special ID on a digital record called the blockchain. This ID is like a fingerprint, showing that the product is real and can be traced back to where it came from.</p>
                    </div>
                    <div className="feature">
                        <h3>Production Chain Verification</h3>
                        <p>From the materials used to make the product to how it's put together, we make sure everything follows good practices for the environment and people.</p>
                    </div>
                    <div className="feature">
                        <h3>Transparency for the consumer</h3>
                        <p>Once everything checks out, we give the product a digital tag called an NFT. This tag helps you access the info, which will guarantee that what you're buying is made responsibly</p>
                    </div>
                </div>
            </section>

        </div>
    );
}