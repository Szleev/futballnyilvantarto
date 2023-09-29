import {auth, googleprovider} from "../config/firebase-config";
import {createUserWithEmailAndPassword, signInWithPopup} from 'firebase/auth'
import {useState} from "react";
import { BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../component_css/Auth.css';
import '../component_css/background.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { initializeApp } from "firebase/app";


export const Auth = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signIn = async () => {
        if (email.trim() === "" || password.trim() === "") {
            toast.error("Az e-mail és jelszó mezők kitöltése kötelező!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } else {
            try {
                await createUserWithEmailAndPassword(auth, email, password);
                navigate('/uploadData');
            } catch (error) {
                console.error("Hiba a regisztráció során:", error);
            }
        }
    };
    const signInWithGoogle = async () => {
        try{
            await signInWithPopup(auth, googleprovider);
            navigate('/checkProfile');
        } catch (err){
            console.error(err);
        }
    };


    return (
        <div>
            <section>

                <div className="air air1"></div>
                <div className="air air2"></div>
                <div className="air air3"></div>
                <div className="air air4"></div>
                <div className="auth-container">
                    <div className="focim-container">
                        <h1 className="focim">Szabadon igazolható labdarúgókat nyilvántartó webes felület</h1>
                    </div>
                    <div className="rounded-square">
                        <img className="loginScreenLogo" src='/logInScreenlogo.png' style={{ width: '200px', height: '200px' }}/>
                        <input
                            className="input-field"
                            placeholder="E-mail..."
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            className="input-field"
                            placeholder="Jelszó..."
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button className="login-button" onClick={signIn}>Belépés</button>

                        <button className="button google-button" onClick={signInWithGoogle}>Belépés Google fiókkal</button>
                        <button>Regisztráció</button>
                    </div>
                </div>
            </section>
        </div>
    );
};