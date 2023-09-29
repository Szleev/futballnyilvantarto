import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { auth, database } from "../config/firebase-config";
import { getAuth, signOut } from "firebase/auth";
import '../component_css/Szerkesztes.css';

export const Szerkesztes = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const [userData, setUserData] = useState({});
    const [newData, setNewData] = useState({
        Magassag: "",
        Suly: "",
        Nemzetiseg: "",
        Poszt: "",
        Email: "",
        Telefonszam: "",
    });
    const updatedData = {
        Magassag: newData.Magassag,
        Suly: newData.Suly,
        Nemzetiseg: newData.Nemzetiseg,
        Email: newData.Email || "",
        Poszt: newData.Poszt,
        Telefonszam: newData.Telefonszam || "",
    };


    useEffect(() => {
        const fetchData = async () => {
            if (auth.currentUser) {
                const jatekosDocRef = doc(database, "Játékosok", auth.currentUser.uid);
                const jatekosDocSnapshot = await getDoc(jatekosDocRef);

                if (jatekosDocSnapshot.exists()) {
                    setUserData(jatekosDocSnapshot.data());
                }
            }
        };

        fetchData();
    }, []);

    const handleUpdate = async () => {
        try {
            if (auth.currentUser) {
                const jatekosDocRef = doc(database, "Játékosok", auth.currentUser.uid);

                const updatedData = {};

                if (newData.Magassag !== userData.Magassag) {
                    updatedData.Magassag = newData.Magassag;
                }
                if (newData.Suly !== userData.Suly) {
                    updatedData.Suly = newData.Suly;
                }
                if (newData.Nemzetiseg !== userData.Nemzetiseg) {
                    updatedData.Nemzetiseg = newData.Nemzetiseg;
                }

                if (newData.Email) {
                    updatedData.Email = newData.Email;
                } else {
                    updatedData.Email = "";
                }

                if (newData.Poszt !== userData.Poszt) {
                    updatedData.Poszt = newData.Poszt;
                }

                if (newData.Telefonszam) {
                    updatedData.Telefonszam = newData.Telefonszam;
                } else {
                    updatedData.Telefonszam = "";
                }

                await updateDoc(jatekosDocRef, updatedData);
                alert("Adatok frissítve!");
                navigate('/profil');
            }
        } catch (err) {
            console.error(err);
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewData({
            ...newData,
            [name]: value,
        });
    };

    const navigateToProfil = () => {
        navigate('/checkProfile');
    };

    const navigateToPlayers = () => {
        navigate('/jatekosok');
    };

    const logOut = async () => {
        const confirmed = window.confirm('Biztosan ki szeretnél lépni?');
        if (confirmed) {
            try {
                await signOut(auth);
                navigate('/');
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="editPlayer-container">
            <div className="navigation-bar">
                <button className="playersbutton" onClick={navigateToPlayers}>Igazolható játékosok</button>
                <button className="profilbutton" onClick={navigateToProfil}>Profil</button>
                <button className="logOut" onClick={logOut}>Kilépés</button>
            </div>
            <div className="edit-form">
                <h1>Szerkesztés</h1>
                <div className="input-container">

                    <label>Email:</label>
                    <input
                        type="text"
                        name="Email"
                        value={newData.Email}
                        onChange={handleInputChange}
                    />

                    <label>Telefonszám:</label>
                    <input
                        type="text"
                        name="Telefonszam"
                        value={newData.Telefonszam}
                        onChange={handleInputChange}
                    />
                    <label>Magasság:</label>
                    <input
                        type="number"
                        name="Magassag"
                        value={newData.Magassag}
                        onChange={handleInputChange}
                    />
                    <label>Súly:</label>
                    <input
                        type="number"
                        name="Suly"
                        value={newData.Suly}
                        onChange={handleInputChange}
                    />
                    <label>Nemzetiség:</label>
                    <input
                        type="text"
                        name="Nemzetiseg"
                        value={newData.Nemzetiség}
                        onChange={handleInputChange}
                    />
                    <label>Poszt:</label>
                    <input
                        type="text"
                        name="Poszt"
                        value={newData.Poszt}
                        onChange={handleInputChange}
                    />
                </div>
                <button className="save" onClick={handleUpdate}>Mentés</button>
            </div>
        </div>
    );
}

export default Szerkesztes;
