import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {collection, doc, getDoc, getDocs, query, updateDoc, where} from 'firebase/firestore';
import { database, storage } from '../config/firebase-config';
import '../component_css/EditKlub.css';
import { uploadBytes, getDownloadURL, ref} from 'firebase/storage';
import {getAuth} from "firebase/auth";


const EditKlub = () => {


    const { KlubId } = useParams();
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState(null);
    const [klubData, setKlubData] = useState({
        Nev: '',
        KepUrl: '',
        LeigazoltJatekosokSzama: '',
    });

    useEffect(() => {
        async function fetchKlubData() {
            try {
                const klubRef = collection(database, 'Klubok');
                const klubQuery = query(klubRef, where('KlubId', '==', KlubId));
                const klubDocs = await getDocs(klubQuery);
                if (!klubDocs.empty) {
                    const klubDoc = klubDocs.docs[0];
                    const data = klubDoc.data();
                    setKlubData(data);
                } else {

                }
            } catch (error) {
                console.error('Hiba történt a klub adatok lekérése közben:', error);
            }
        }

        fetchKlubData();
    }, [KlubId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'KepUrl') {
            setProfileImage(e.target.files[0]);
        } else {
            setKlubData({ ...klubData, [name]: value });
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) {
                console.error('Felhasználó nincs bejelentkezve.');
                return;
            }

            const klubRef = collection(database, 'Klubok');
            const klubQuery = query(klubRef, where('KlubId', '==', KlubId));
            const klubDocs = await getDocs(klubQuery);

            if (!klubDocs.empty) {
                const klubDoc = klubDocs.docs[0];
                const klubDocId = klubDoc.id;

                // Kép feltöltése a megfelelő mappába
                const storageRef = ref(storage, `Klub_kepek/${user.uid}`);
                const imageRef = ref(storageRef, `${klubDocId}_profile_image`);

                if (profileImage) {
                    await uploadBytes(imageRef, profileImage);
                    const downloadUrl = await getDownloadURL(imageRef);

                    setKlubData({ ...klubData, KepUrl: downloadUrl });
                }

                const updatedKlubRef = doc(database, 'Klubok', klubDocId);
                await updateDoc(updatedKlubRef, klubData);
                console.log('Klub adatai sikeresen frissítve.');
                navigate('/checkProfile');
            } else {
                console.error('Klub nem található.');
            }
        } catch (error) {
            console.error('Hiba történt a klub adatok frissítése közben:', error);
        }
    };



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

    return (
        <div className="edit-klub-container">
            <div className="navigation-bar">
                <button className="playersbutton" onClick={navigateToPlayers}>Igazolható játékosok</button>
                <button className="profilbutton" onClick={navigateToProfil}>Profil</button>
                <button className="profilbutton" onClick={navigateToClubs}>Klubbok</button>
                <button className="logOut" onClick={logOut}>Kilépés</button>
            </div>
            <div>
                <h2>Klub adatainak szerkesztése</h2>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="Nev">Klub neve:</label>
                        <input
                            type="text"
                            id="Nev"
                            name="Nev"
                            value={klubData.Nev}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="KepUrl">Profilkép kiválasztása:</label>
                        <input
                            type="file"
                            id="KepUrl"
                            name="KepUrl"
                            accept="image/*"
                            onChange={handleInputChange}
                        />
                    </div>
                    <button type="submit">Mentés</button>
                </form>
            </div>
        </div>
    );
};

export default EditKlub;
