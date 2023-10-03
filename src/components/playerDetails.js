import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {collection, getDocs, getDoc, doc, where, query} from "firebase/firestore";
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
                const querySnapshot = await getDocs(query(jatekosCollectionRef, where("userId", "==", playerId)));

                if (!querySnapshot.empty) {
                    const jatekosDoc = querySnapshot.docs[0];
                    setSelectedPlayer(jatekosDoc.data());
                } else {
                    navigate('/jatekosok');
                }
            } catch (error) {
                console.error("Hiba a játékos lekérdezése közben:", error);
            }
        };



        fetchPlayerDetails();
    }, [playerId, navigate]);

    const navigateToProfil = () => {
        navigate("/profil");
    };

    const navigateToPlayers = () => {
        navigate("/jatekosok");
    };
    const navigateToClubs = () =>{
        navigate(`/klubbok`);
    }

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
                <button className="profilbutton" onClick={navigateToClubs}>Klubbok</button>
                <button className="logOut" onClick={logOut}>
                    Kilépés
                </button>
            </div>
            <h1 className="detail-header">Játékos részletei</h1>
            {selectedPlayer ? (
                <div className="detail-div">
                    <img
                        className="player-profile-image"
                        src={selectedPlayer.ProfilkepUrl}
                        alt={`${selectedPlayer.Vezeteknev} ${selectedPlayer.Keresztnev}`}
                    />
                    <table className="player-details">
                        <tr>
                            <th>Név:</th>
                            <td>{`${selectedPlayer.Vezeteknev} ${selectedPlayer.Keresztnev}`}</td>
                        </tr>
                        <tr>
                            <th>E-mail:</th>
                            <td>{selectedPlayer.Email}</td>
                        </tr>
                        <tr>
                            <th>Telefonszám:</th>
                            <td>{selectedPlayer.Telefonszam}</td>
                        </tr>
                        <tr>
                            <th>Születési hely:</th>
                            <td>{`${selectedPlayer.Szul_hely_irszam}, ${selectedPlayer.Szul_hely}`}</td>
                        </tr>
                        <tr>
                            <th>Születési év:</th>
                            <td>{selectedPlayer.Szul_ev}</td>
                        </tr>
                        <tr>
                            <th>Magasság:</th>
                            <td>{selectedPlayer.Magassag} cm</td>
                        </tr>
                        <tr>
                            <th>Súly:</th>
                            <td>{selectedPlayer.Suly} kg</td>
                        </tr>
                        <tr>
                            <th>Nemzetiség:</th>
                            <td>{selectedPlayer.Nemzetiség}</td>
                        </tr>
                        <tr>
                            <th>Poszt:</th>
                            <td>{selectedPlayer.Poszt}</td>
                        </tr>
                    </table>
                </div>
            ) : (
                <p className="loading">Betöltés...</p>
            )}

        </div>
    );
};

export default PlayerDetails;
