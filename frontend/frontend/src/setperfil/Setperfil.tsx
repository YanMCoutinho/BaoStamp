import './style.scss';

export default function SetPerfil() {
    return (
        <div className="set-perfil-container">
            <h1>Select Your Role</h1>
            <div className="options">
                <div className="option" onClick={() => window.location.href='/company'}>
                    <h2>Company</h2>
                    <p>Register your products and issue seals</p>
                    <ul>
                        <li>Build trust with your customers</li>
                        <li>Ensure product authenticity</li>
                        <li>Track and manage your supply chain</li>
                        <li>Promote sustainability and eco-friendly practices</li>
                    </ul>
                </div>
                <div className="option" onClick={() => window.location.href='/cliente'}>
                    <h2>Customer</h2>
                    <p>View the supply chain of registered products</p>
                    <ul>
                        <li>Verify product authenticity</li>
                        <li>Gain transparency into product origins</li>
                        <li>Support brands that value sustainability</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
