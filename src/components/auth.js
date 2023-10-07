import {auth, googleprovider} from "../config/firebase-config";
import {createUserWithEmailAndPassword, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth'
import {useState} from "react";
import { BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../component_css/Auth.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { initializeApp } from "firebase/app";


export const Auth = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signUp = async () => {
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
    const signInWithEmailAndPass = async () => {
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
                await signInWithEmailAndPassword(auth, email, password);
                navigate('/checkProfile');
            } catch (error) {
                console.error("Hiba a belépés során:", error);
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
        <div className="auth-container">
            <div className="rounded-square">
                <div className="left-side">
                    <img src="/loginpagebg.png" className="loginpagebg" />
                </div>
                <div className="right-side">
                    <h2>Szabadon igazolható labdarúgókat nyilvántartó webes felület</h2>
                    <h2>Üdvözöljük!</h2>
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
                    <button className="login-button" onClick={signInWithEmailAndPass}>
                        Belépés
                    </button>
                    <button className="register-button" onClick={signUp}>
                        Regisztráció
                    </button>
                    <p>vagy</p>
                    <button
                        className="button google-button"
                        onClick={signInWithGoogle}
                    >
                        Belépés Google fiókkal
                    </button>
                </div>
            </div>

        </div>
    );
};