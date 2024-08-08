import connect from '@web3-onboard/core/dist/connect';
import { Cartesi } from '../utils/ConnectionService';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import './style.scss';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../header/Header';

export default function Sign() {
    const [connected, setConnected] = useState(false);
    const [user, setUser] = useState({
        cnpj: "",
        corporate_name: "",
        fantasy_name: "",
        open_date: "yyyy-mm-dd",
        size: "",
        juridical_nature: "",
        MEI: true,
        simple: true,
        type: "SA",
        situation: "N/A"
    });

    let cartesi: Cartesi | null = null;

  try {
    cartesi = new Cartesi();
  } catch (error) {
    console.error("Error initializing Cartesi:", error);
    toast.error('Error initializing Cartesi');
  }

    useEffect(() => {
        if (!cartesi?.isConnected()) {
            cartesi?.connectWallet().then(() => {
                setConnected(true);
            }
            );
        } else {
            setConnected(true);
        }

    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log("is connected? ", connected)
        if (!connected) {
            toast.error("Connect your wallet first");
            return;
        }
        const signNewUser = await cartesi?.sign(user);
        if (signNewUser) {
            toast.success("User signed successfully");
            window.location.href = "/home";
        } else {
            toast.error("Error signing user");
        }
    }

    return (
        <div className="container">
            < Header />
            <div className="form">
                <h1>Sign</h1>
                <form>
                    <h3>CNPJ</h3>
                    <input
                        type="text"
                        name="cnpj"
                        placeholder="CNPJ"
                        value={user.cnpj}
                        onChange={(e) => setUser({ ...user, cnpj: e.target.value })}
                    />
                    <h3>Corporate Name</h3>
                    <input
                        type="text"
                        name="corporate_name"
                        placeholder="Corporate Name"
                        value={user.corporate_name}
                        onChange={(e) => setUser({ ...user, corporate_name: e.target.value })}
                    />
                    <h3>Fantasy Name</h3>

                    <input
                        type="text"
                        name="fantasy_name"
                        placeholder="Fantasy Name"
                        value={user.fantasy_name}
                        onChange={(e) => setUser({ ...user, fantasy_name: e.target.value })}
                    />
                    <h3>Open Date</h3>

                    <input
                        type="text"
                        name="open_date"
                        placeholder="Open Date"
                        value={user.open_date}
                        onChange={(e) => setUser({ ...user, open_date: e.target.value })}
                    />
                    <h3>Size</h3>

                    <input
                        type="text"
                        name="porte"
                        placeholder="porte"
                        value={user.size}
                        onChange={(e) => setUser({ ...user, size: e.target.value })}
                    />
                    <h3>Juridical Nature</h3>
                    <input
                        type="text"
                        name="juridical_nature"
                        placeholder="Juridical Nature"
                        value={user.juridical_nature}
                        onChange={(e) => setUser({ ...user, juridical_nature: e.target.value })}
                    />
                    <label htmlFor="">Opção pelo MEI</label>
                    <input
                        type="checkbox"
                        name="MEI"
                        placeholder="MEI"
                        checked={user.MEI}
                        onChange={(e) => setUser({ ...user, MEI: e.target.checked })}
                    />
                    <label htmlFor="">Opção pelo simples</label>
                    <input
                        type="checkbox"
                        name="simple"
                        placeholder="Simple"
                        checked={user.simple}
                        onChange={(e) => setUser({ ...user, simple: e.target.checked })}
                    />
                    <input
                        type="text"
                        name="type"
                        placeholder="Type"
                        value={user.type}
                        onChange={(e) => setUser({ ...user, type: e.target.value })}
                    />
                    <input
                        type="text"
                        name="situation"
                        placeholder="Situation"
                        value={user.situation}
                        onChange={(e) => setUser({ ...user, situation: e.target.value })}
                    />
                    <button onClick={handleSubmit}>Sign</button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}