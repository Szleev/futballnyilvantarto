import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { query, where, getDocs, collection, doc, deleteDoc } from "firebase/firestore";
import { auth, database, storage } from "../config/firebase-config";
import '../component_css/LeigazoltJatekosok.css';
import { deleteObject, listAll, ref } from "firebase/storage";
import { getAuth } from "firebase/auth";

export const LeigazoltJatekosok = () => {

    const navigate = useNavigate();
    const { KlubId } = useParams();

    const [leigazoltJatekosok, setLeigazoltJatekosok] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const leigazoltJatekosokData = [];

                const leigazolasokCollectionRef = collection(database, "Leigazolasok");
                const leigazolasokQuery = query(leigazolasokCollectionRef, where("KlubId", "==", KlubId));
                const leigazolasokSnapshot = await getDocs(leigazolasokQuery);

                for (const leigazolasDoc of leigazolasokSnapshot.docs) {
                    const leigazolasData = leigazolasDoc.data();
                    const jatekosId = leigazolasData.userId;

                    const jatekosQuery = query(collection(database, "Játékosok"), where("userId", "==", jatekosId));
                    const jatekosSnapshot = await getDocs(jatekosQuery);

                    if (!jatekosSnapshot.empty) {
                        const jatekosDoc = jatekosSnapshot.docs[0];
                        const jatekosData = jatekosDoc.data();

                        leigazoltJatekosokData.push({
                            jatekosId,
                            vezeteknev: jatekosData.Vezeteknev,
                            keresztnev: jatekosData.Keresztnev,
                            poszt: jatekosData.Poszt,
                            igazolasDatum: leigazolasData.igazolasDatum,
                            profilkepUrl: jatekosData.ProfilkepUrl,
                        });
                    } else {
                        console.error(`Nem található játékos a Játékosok táblában ezzel az azonosítóval: ${jatekosId}`);
                    }
                }

                setLeigazoltJatekosok(leigazoltJatekosokData);
            } catch (error) {
                console.error("Hiba a leigazolt játékosok lekérdezése közben:", error);
            }
        };

        fetchData();
    }, [KlubId]);

    const handleElbocsajtas = async (jatekosId) => {
        const confirmed = window.confirm('Biztosan el akarod bocsátani ezt a játékost??');
        if (confirmed){
            try {
                const leigazolasokCollectionRef = collection(database, "Leigazolasok");
                const leigazolasokQuery = query(leigazolasokCollectionRef, where("userId", "==", jatekosId));
                const leigazolasokSnapshot = await getDocs(leigazolasokQuery);

                if (!leigazolasokSnapshot.empty) {
                    const leigazolasDoc = leigazolasokSnapshot.docs[0];
                    const leigazolasDocRef = doc(database, "Leigazolasok", leigazolasDoc.id);
                    await deleteDoc(leigazolasDocRef);
                }

                setLeigazoltJatekosok((prevJatekosok) => prevJatekosok.filter((jatekos) => jatekos.jatekosId !== jatekosId));

            } catch (error) {
                console.error('Hiba az elbocsátás közben:', error);
            }
        }
    };

    const navigateToProfil = () => {
        navigate('/checkProfile');
    };

    const navigateToPlayers = () => {
        navigate('/jatekosok');
    };

    const navigateToClubs = () => {
        navigate(`/klubbok`);
    };

    const logOut = async () => {
        const confirmed = window.confirm("Biztosan ki szeretnél lépni?");
        if (confirmed) {
            try {
                navigate("/");
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="leigazolt-jatekosok-container">
            <div className="navigation-bar">
                <p className="szilny">Szabadon igazolható labdarúgókat nyilvántartó webes felület</p>
                <button className="playersbutton" onClick={navigateToPlayers}>Igazolható játékosok</button>
                <button className="profilbutton" onClick={navigateToProfil}>Profil</button>
                <button className="profilbutton" onClick={navigateToClubs}>Klubok</button>
                <button className="logOut" onClick={logOut}>Kilépés</button>
            </div>
            <h1 className="profileh1">Klub leigazolt játékosai</h1>
            <table className="jatekos-table">
                <thead>
                <tr>
                    <th>Profilkép</th>
                    <th>Név</th>
                    <th>Poszt</th>
                    <th>Igazolás dátuma</th>
                    <th>Művelet</th>
                </tr>
                </thead>
                <tbody>
                {leigazoltJatekosok.length === 0 ? (
                    <tr>
                        <td colSpan="5">Nincs leigazolt játékos a klubban.</td>
                    </tr>
                ) : (
                    leigazoltJatekosok.map((jatekos) => (
                        <tr key={jatekos.jatekosId}>
                            <td>
                                <img
                                    className="jatekos-card-profilkep"
                                    src={jatekos.profilkepUrl}
                                    alt={`${jatekos.vezeteknev} ${jatekos.keresztnev}`}
                                />
                            </td>
                            <td>{`${jatekos.vezeteknev} ${jatekos.keresztnev}`}</td>
                            <td>{jatekos.poszt}</td>
                            <td>{jatekos.igazolasDatum}</td>
                            <td>
                                <button onClick={() => handleElbocsajtas(jatekos.jatekosId)}>
                                    Elbocsátás
                                </button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default LeigazoltJatekosok;
