import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    addDoc,
    collection,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { database, storage } from "../config/firebase-config";
import { v4 as uuidv4 } from 'uuid';
import '../component_css/addKlub.css';
import { getStorage, ref } from 'firebase/storage';


export const AddKlub = () => {
    const [klubNev, setKlubNev] = useState("");
    const [klubID, setKlubID] = useState(uuidv4());
    const [isClub, setIsClub] = useState(true);
    const [klubKepUrl, setKlubKepUrl] = useState(null);
    const navigate = useNavigate();
    const auth = getAuth();

    const klubokCollectionRef = collection(database, "Klubok");

    const adatokBeadasa = async () => {
        if (klubNev) {
            const confirmed = window.confirm("Biztosan mented az adatokat?");
            if (confirmed) {
                try {
                    const klubData = {
                        KlubNev: klubNev,
                        KlubID: klubID,
                        IsClub: isClub,
                        KlubKepUrl: klubKepUrl,
                    };

                    // Létrehozás előtt ellenőrizd, hogy a tábla és a mappa létezik-e
                    const klubTableRef = collection(database, "Klubok");
                    const klubKepFolderRef = storage.ref(`Klub_kepek/${klubNev}/`);

                    // Ellenőrizd, hogy a tábla nem létezik-e, és csak akkor hozd létre, ha nem
                    const klubTableExists = await getDocs(klubTableRef).then((snapshot) => !snapshot.empty);
                    if (!klubTableExists) {
                        await addDoc(klubTableRef, {}); // Üres dokumentum hozzáadása a táblához
                    }

                    // Ellenőrizd, hogy a mappa nem létezik-e, és csak akkor hozd létre, ha nem
                    const klubKepFolderExists = await klubKepFolderRef.listAll()
                        .then((items) => items.length > 0);
                    if (!klubKepFolderExists) {
                        await klubKepFolderRef.child("placeholder").put(""); // Üres fájl feltöltése a mappa létrehozásához
                    }

                    // Adatok hozzáadása a táblához
                    await addDoc(klubTableRef, klubData);
                    //navigate("/profil");
                } catch (err) {
                    console.error(err);
                }
            }
        } else {
            alert("Minden mezőt ki kell tölteni!");
        }
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

    const uploadKlubKep = async (file) => {
        if (!file) {
            alert("Válassz ki egy fájlt a feltöltéshez!");
            return;
        }

        const user = auth.currentUser;

        if (!user) {
            console.error("Nincs bejelentkezett felhasználó.");
            return;
        }

        const klubKepFolderRef = storage.ref(`Klub_kepek/${klubNev}/`);

        try {
            const snapshot = await klubKepFolderRef.child(file.name).put(file);
            const url = await snapshot.ref.getDownloadURL();

            setKlubKepUrl(url);
        } catch (err) {
            console.error(err);
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
            <div className="input-container">
                <input
                    placeholder="Klubnév..."
                    onChange={(e) => setKlubNev(e.target.value)}
                    required
                />
                <input
                    type="file"
                    onChange={(e) => uploadKlubKep(e.target.files[0])}
                    required
                />
            </div>

            <button className="save" onClick={adatokBeadasa}>
                Adatok mentése
            </button>
        </div>
    );
};

export default AddKlub;
