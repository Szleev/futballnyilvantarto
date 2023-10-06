import React, {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from "firebase/firestore";
import {ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from 'uuid';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import '../component_css/addKlub.css';
import {auth, database, storage} from "../config/firebase-config";

export const AddKlub = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const authUser = auth.currentUser;

    const [klubNev, setKlubNev] = useState("");
    const [klubKepUpload, setKlubKepUpload] = useState(null);
    const [isUploadSuccess, setIsUploadSuccess] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [klubKepUrl, setKlubKepUrl] = useState("");

    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);



    const klubokCollectionRef = collection(database, "Klubok");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsUserLoggedIn(true);
            } else {
                setIsUserLoggedIn(false);
            }
        });

        return () => unsubscribe();
    }, [auth]);


    const uploadKlubKep = async () => {
        if (!klubKepUpload) {
            alert('Válassz ki egy klubképet a feltöltéshez!');
            return;
        }

        const user = auth.currentUser;

        if (!user) {
            console.error('Nincs bejelentkezett felhasználó.');
            return;
        }

        const fileFolderRef = ref(
            storage,
            `Klub_kepek/${user.uid}/${klubKepUpload.name + v4()}`
        );

        try {
            const snapshot = await uploadBytes(fileFolderRef, klubKepUpload);
            const klubKepUrl = await getDownloadURL(snapshot.ref);

            setIsUploadSuccess(true);
            setTimeout(() => {
                setIsUploadSuccess(false);
            }, 3000);

            setKlubKepUrl(klubKepUrl);

            setShowSuccessMessage(true);
        } catch (err) {
            console.error(err);
        }
    };

    const adatokBeadasa = async () => {
        if (!isUserLoggedIn) {
            alert("A klub létrehozásához be kell jelentkezned!");
            return;
        }
        if (klubNev && klubKepUrl) {
            const confirmed = window.confirm('Biztosan mented az adatokat?');
            if (confirmed) {
                try {

                    const klubData = {
                        KlubId: authUser.uid,
                        Nev: klubNev,
                        KepUrl: klubKepUrl,
                        IsClub: true,
                        LeigazoltJatekosokSzama: 0,
                    };

                    await addDoc(klubokCollectionRef, klubData);

                    navigate('/klubprofil');
                } catch (err) {
                    console.error(err);
                }
            }
        } else {
            alert('Minden mezőt ki kell tölteni, és egy klubképet is fel kell tölteni!');
        }
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

    const navigateToProfil = () => {
        navigate('/profil');
    };

    const navigateToPlayers = () => {
        navigate('/jatekosok');
    };

    const navigateToClubs = () =>{
        navigate(`/klubbok`);
    }

    return (
        <div className="klub-register-container">
            <div className="navigation-bar">
                <button className="playersbutton" onClick={navigateToPlayers}>Igazolható játékosok</button>
                <button className="profilbutton" onClick={navigateToProfil}>Profil</button>
                <button className="profilbutton" onClick={navigateToClubs}>Klubbok</button>
                <button className="logOut" onClick={logOut}>Kilépés</button>
            </div>
            <h1 className="profileh1">Regisztrálja a klub adatait!</h1>
            <div className="addKlub-container">
                <div className="klub-input-container">
                    <input placeholder="Klubnév..." onChange={(e) => setKlubNev(e.target.value)} required />
                </div>
                <div className="klub-image-container">
                    <h2>Klubkép feltöltése</h2>
                    <input type="file" onChange={(e) => setKlubKepUpload(e.target.files[0])} />
                    <button onClick={uploadKlubKep}>Fájl feltöltése</button>
                    {isUploadSuccess && (
                        <p className="klub-success-message fade-out">Sikeres feltöltés</p>
                    )}
                </div>
            </div>

            <button className="klub-save" onClick={adatokBeadasa}>Adatok mentése</button>
        </div>
    );
};

export default AddKlub;
