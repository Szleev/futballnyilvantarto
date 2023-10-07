import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, where, query } from "firebase/firestore";
import { auth, database } from "../config/firebase-config";
import { getAuth, signOut } from "firebase/auth";
import "../component_css/klubDetails.css";

export const KlubDetails = () => {

    const navigate = useNavigate();


    useEffect(() => {

    }, []);

    const navigateToProfil = () => {
        navigate("/profil");
    };

    const navigateToPlayers = () => {
        navigate("/jatekosok");
    };

    const navigateToClubs = () => {
        navigate(`/klubbok`);
    };

    const logOut = async () => {
        const confirmed = window.confirm("Biztosan ki szeretnél lépni?");
        if (confirmed) {
            try {
                await signOut(auth);
                navigate("/");
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="klub-details-container">
            <div className="navigation-bar">
                <button className="playersbutton" onClick={navigateToPlayers}>
                    Igazolható játékosok
                </button>
                <button className="profilbutton" onClick={navigateToProfil}>
                    Profil
                </button>
                <button className="profilbutton" onClick={navigateToClubs}>
                    Klubbok
                </button>
                <button className="logOut" onClick={logOut}>
                    Kilépés
                </button>
            </div>
            <h1 className="profileh1">Klub részletei</h1>

        </div>
    );
};

export default KlubDetails;
