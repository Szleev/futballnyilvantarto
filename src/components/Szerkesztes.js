import { useEffect, useState } from "react";
import { useNavigate, useParams  } from 'react-router-dom';
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { auth, database } from "../config/firebase-config";
import { getAuth, signOut } from "firebase/auth";
import '../component_css/Szerkesztes.css';
import transition from "../transition";


export const Szerkesztes = () => {

    const navigate = useNavigate();
    const auth = getAuth();
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (userId) {
                    const userDocRef = doc(database, "Játékosok", userId);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        setUserData(userData);
                    } else {
                        console.log("A felhasználó dokumentuma nem található.");
                    }
                } else {
                    console.log("Nincs felhasználói azonosító.");
                }
            } catch (error) {
                console.error("Hiba a felhasználó adatok lekérdezése közben:", error);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleInputChange = (fieldName, value) => {

        const updatedUserData = { ...userData };
        updatedUserData[fieldName] = value;

        setUserData(updatedUserData);
    };

    const saveChanges = async () => {
        try {
            const userDocRef = doc(database, "Játékosok", userId);
            const docSnapshot = await getDoc(userDocRef);

            if (docSnapshot.exists()) {
                await updateDoc(userDocRef, userData);
                alert("A változtatások el lettek mentve!");
            } else {
                alert("A felhasználói adatok nem találhatók!");
            }
        } catch (error) {
            console.error("Hiba a változtatások mentése közben:", error);
            alert("Hiba történt a változtatások mentése közben.");
        }
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
            <h1>Adatok szerkesztése</h1>
            {userData ? (
                <>
                    <div>
                        <label>Vezetéknév:</label>
                        <input
                            type="text"
                            value={userData.Vezeteknev}
                            onChange={(e) => handleInputChange("vezeteknev", e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Keresztnév:</label>
                        <input
                            type="text"
                            value={userData.Keresztnev}
                            onChange={(e) => handleInputChange("keresztnev", e.target.value)}
                        />
                    </div>
                    <button onClick={saveChanges}>Mentés</button>
                </>
            ) : (
                <p>Betöltés...</p>
            )}
        </div>

    );
}

export default Szerkesztes;
