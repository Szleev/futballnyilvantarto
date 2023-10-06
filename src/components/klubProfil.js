import React, { useEffect, useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import {query, where, getDocs, collection, doc, deleteDoc} from "firebase/firestore";
import { auth, database, storage } from "../config/firebase-config";
import '../component_css/klubProfil.css';
import {deleteObject, listAll, ref} from "firebase/storage";

export const KlubProfil = () => {
    const navigate = useNavigate();

    const [klubData, setKlubData] = useState(null);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            console.error('Nincs bejelentkezett felhasználó.');
            return;
        }

        const fetchData = async () => {
            const userId = user.uid;
            const klubokQuery = query(collection(database, "Klubok"), where("KlubId", "==", userId));
            const klubokSnapshot = await getDocs(klubokQuery);

            if (!klubokSnapshot.empty) {
                const klubDoc = klubokSnapshot.docs[0];
                const klubDocId = klubDoc.id;
                const klubData = klubDoc.data();
                setKlubData(klubData);
            }
        };

        fetchData();
    }, []);

    const navigateToProfil = () => {
        navigate('/profil');
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
    const deleteKlub = async () => {
        const user = auth.currentUser;
        if (!user) {
            console.error('Nincs bejelentkezett felhasználó.');
            return;
        }

        const userKlubId = user.uid;

        const confirmed = window.confirm('Biztosan törlöd a klubot?');
        if (!confirmed) {
            return;
        }

        try {
            const klubQuery = query(collection(database, 'Klubok'), where('KlubId', '==', userKlubId));
            const klubDocs = await getDocs(klubQuery);

            if (!klubDocs.empty) {
                const klubDoc = klubDocs.docs[0];

                await deleteDoc(klubDoc.ref);

                const storageRef = ref(storage, `Klub_kepek/${userKlubId}`);
                const files = await listAll(storageRef);
                for (const file of files.items) {
                    await deleteObject(file);
                }

            } else {
            }
        } catch (err) {
            console.error('Hiba a klub törlése közben:', err);
        }

        navigate('/uploadData');
    };


    return (
        <div className="klubprofil-container">
            <div className="navigation-bar">
                <button className="playersbutton" onClick={navigateToPlayers}>Igazolható játékosok</button>
                <button className="profilbutton" onClick={navigateToProfil}>Profil</button>
                <button className="profilbutton" onClick={navigateToClubs}>Klubbok</button>
                <button className="logOut" onClick={logOut}>Kilépés</button>
            </div>
            <h1 className="profileh1">Klub profilja:</h1>
            <div>
                {klubData ? (
                    <div className="klub-profil-adat">
                        <div className="klub-image-container">
                            <img src={klubData.KepUrl} alt="Klub képe" />
                        </div>
                        <div className="klub-table-container">
                            <table>
                                <tbody>
                                <tr>
                                    <th>Klub neve:</th>
                                    <td>{klubData.Nev}</td>
                                </tr>
                                <tr>
                                    <th>Leigazolt játékosok száma:</th>
                                    <td>{klubData.LeigazoltJatekosokSzama}</td>
                                </tr>
                                <tr>
                                    <th>Klub egyedi azonosítója:</th>
                                    <td>{klubData.KlubId}</td>
                                </tr>
                                </tbody>
                            </table>
                            <div className="button-container">
                                <Link to={`/editklub/${klubData.KlubId}`}>
                                    <button type="button">Szerkesztés</button>
                                </Link>
                                <button onClick={deleteKlub}>Klub törlése</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Nincs klub kiválasztva.</p>
                )}
            </div>
        </div>
    );
};

export default KlubProfil;
