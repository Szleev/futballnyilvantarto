import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, where, query } from "firebase/firestore";
import { auth, database } from "../config/firebase-config";
import { getAuth, signOut } from "firebase/auth";
import "../component_css/Klub.css";

export const Klubbok = () => {

    const navigate = useNavigate();
    const [klubok, setKlubok] = useState([]);
    const [klubokLeigazolasokSzama, setKlubokLeigazolasokSzama] = useState({});

    useEffect(() => {
        const fetchKlubok = async () => {
            try {
                const klubokCollectionRef = collection(database, "Klubok");
                const klubokSnapshot = await getDocs(klubokCollectionRef);
                const klubokData = [];

                const tempKlubokLeigazolasokSzama = {};

                for (const klubDoc of klubokSnapshot.docs) {
                    const klubData = klubDoc.data();
                    klubokData.push(klubData);

                    const leigazolasokQuery = query(collection(database, "Leigazolasok"), where("KlubId", "==", klubData.KlubId));
                    const leigazolasokSnapshot = await getDocs(leigazolasokQuery);
                    tempKlubokLeigazolasokSzama[klubData.KlubId] = leigazolasokSnapshot.size;
                }

                setKlubok(klubokData);
                setKlubokLeigazolasokSzama(tempKlubokLeigazolasokSzama);
            } catch (error) {
                console.error("Hiba a klubok lekérdezése közben:", error);
            }
        };

        fetchKlubok();
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
        <div className="klub-container">
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
            <h1 className="profileh1">Klubbok</h1>
            <div className="klub-list">
                {klubok.map((klub) => (
                    <div key={klub.KlubId} className="klub-card">
                        <img
                            className="klub-card-profilkep"
                            src={klub.KepUrl}
                            alt={klub.Nev}
                        />
                        <h2>{klub.Nev}</h2>
                        {/* Megjelenítjük a leigazolt játékosok számát */}
                        <p>Leigazolt játékosok: {klubokLeigazolasokSzama[klub.KlubId] || 0}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Klubbok;
