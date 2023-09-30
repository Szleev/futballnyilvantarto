import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { auth, database } from "../config/firebase-config";
import { getAuth, signOut } from "firebase/auth";
import "../component_css/browsePlayers.css";

export const Jatekosok = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const [jatekosok, setJatekosok] = useState([]);

    useEffect(() => {
        const fetchJatekosok = async () => {
            try {
                const jatekosCollectionRef = collection(database, "Játékosok");
                const jatekosSnapshot = await getDocs(jatekosCollectionRef);
                const jatekosokData = [];

                jatekosSnapshot.forEach((doc) => {
                    jatekosokData.push(doc.data());
                });

                setJatekosok(jatekosokData);
            } catch (error) {
                console.error("Hiba a játékosok lekérdezése közben:", error);
            }
        };

        fetchJatekosok();
    }, []);

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
        <div className="jatekos-container">
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
            <h1 className="jatekosok-title">Igazolható játékosok</h1>
            <div className="jatekos-list">
                {jatekosok.map((jatekos) => (
                    <div key={jatekos.uid} className="jatekos-card">
                        <img
                            className="jatekos-card-profilkep"
                            src={jatekos.ProfilkepUrl}
                            alt={`${jatekos.Vezeteknev} ${jatekos.Keresztnev}`}
                        />
                        <h2>{`${jatekos.Vezeteknev} ${jatekos.Keresztnev}`}</h2>
                        <p>{jatekos.Poszt}</p>
                        <button>Játékos részletei</button>
                    </div>
                ))}

            </div>

        </div>
    );
};

export default Jatekosok;
