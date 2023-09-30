import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { auth, database } from "../config/firebase-config";
import { getAuth, signOut } from "firebase/auth";
import "../component_css/playerDetails.css";

const PlayerDetails = () => {
    const navigate = useNavigate();
    const { playerId } = useParams();

    const auth = getAuth();
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    useEffect(() => {
        const fetchPlayerDetails = async () => {
            try {
                const jatekosCollectionRef = collection(database, "Játékosok");
                const jatekosSnapshot = await getDocs(jatekosCollectionRef);
                const jatekosokData = [];

                jatekosSnapshot.forEach((doc) => {
                    jatekosokData.push(doc.data());
                });

                const player = jatekosokData.find((jatekos) => jatekos.uid === playerId);

                if (player) {
                    setSelectedPlayer(player);
                } else {
                    navigate("/jatekosok");
                }
            } catch (error) {
                console.error("Hiba a játékosok lekérdezése közben:", error);
            }
        };

        fetchPlayerDetails();
    }, [playerId, navigate]);

    const navigateToProfil = () => {
        navigate("/checkProfile");
    };

    const navigateToPlayers = () => {
        navigate("/jatekosok");
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
        <div className="player-details-container">
            <div className="navigation-bar">
                <button className="playersbutton" onClick={navigateToPlayers}>
                    Igazolható játékosok
                </button>
                <button className="profilbutton" onClick={navigateToProfil}>
                    Profil
                </button>
                <button className="logOut" onClick={logOut}>
                    Kilépés
                </button>
            </div>
            {selectedPlayer ? (
                <div className="player-details">
                    <h1>{`${selectedPlayer.Vezeteknev} ${selectedPlayer.Keresztnev}`}</h1>
                    <p>E-mail: {selectedPlayer.Email}</p>
                    <p>Telefonszám: {selectedPlayer.Telefonszam}</p>
                    <p>Születési hely: {selectedPlayer.Szul_hely_irszam}, {selectedPlayer.Szul_hely}</p>
                    <p>Születési év: {selectedPlayer.Szul_ev}</p>
                    <p>Magasság: {selectedPlayer.Magassag} cm</p>
                    <p>Súly: {selectedPlayer.Suly} kg</p>
                    <p>Nemzetiség: {selectedPlayer.Nemzetiség}</p>
                    <p>Poszt: {selectedPlayer.Poszt}</p>
                    {/* További adatok megjelenítése */}
                </div>
            ) : (
                <p>Betöltés...</p>
            )}
        </div>
    );
};

export default PlayerDetails;
