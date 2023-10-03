import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, doc, getDocs } from "firebase/firestore";
import { auth, database, storage } from "../config/firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, signOut } from "firebase/auth";
import "../component_css/addKlub.css";
import { v4 } from "uuid";

export const AddKlub = ({ isClub }) => {
    const navigate = useNavigate();
    const [klubNev, setKlubNev] = useState("");
    const [imageUpload, setImageUpload] = useState(null);
    const [isUploadSuccess, setIsUploadSuccess] = useState(false);

    const collectionName = isClub ? "Klubok" : "Játékosok";


    const klubCollectionRef = collection(database, collectionName);

    useEffect(() => {

    }, []);

    const uploadFile = async () => {
        if (!imageUpload) {
            alert("Válassz ki egy fájlt a feltöltéshez!");
            return;
        }

        try {
            const snapshot = await uploadBytes(
                ref(storage, `${isClub ? "Klub_kepek" : "Jatekos_profil_kepek"}/${imageUpload.name + v4()}`),
                imageUpload
            );
            const imageUrl = await getDownloadURL(snapshot.ref);

            setIsUploadSuccess(true);
            setTimeout(() => {
                setIsUploadSuccess(false);
            }, 3000);

            const itemId = v4();

            const itemData = {
                Id: itemId,
                Nev: klubNev,
                KepUrl: imageUrl,
            };

            await addDoc(klubCollectionRef, itemData);
            navigate(isClub ? "/klubbk" : "/profil");
        } catch (err) {
            console.error(err);
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

    return (
        <div className="data-container">
            <div className="navigation-bar">
                <button className="profilbutton" onClick={() => navigate("/profil")}>
                    Profil
                </button>
                <button className="klubokbutton" onClick={() => navigate("/klubok")}>
                    Klubbok
                </button>
                <button className="logOut" onClick={logOut}>
                    Kilépés
                </button>
            </div>
            <h1 className="klubh1">
                {isClub ? "Regisztrálj egy új klubot!" : "Regisztrálj egy új játékost!"}
            </h1>
            <div className="input-container">
                <input
                    placeholder={isClub ? "Klub neve..." : "Keresztnév..."}
                    onChange={(e) => setKlubNev(e.target.value)}
                    required
                />
            </div>
            <div className="image-container">
                <h2>{isClub ? "Klubkép feltöltése" : "Profilkép feltöltése"}</h2>
                <input type="file" onChange={(e) => setImageUpload(e.target.files[0])} />
                <button onClick={uploadFile}>Fájl feltöltése</button>
                {isUploadSuccess && (
                    <p className="success-message fade-out">Sikeres feltöltés</p>
                )}
            </div>
        </div>
    );
};

export default AddKlub;
