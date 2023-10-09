import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import {doc, updateDoc, getDocs, query, where, collection, deleteDoc} from "firebase/firestore";
import { auth, database, storage } from "../config/firebase-config";
import { getAuth, signOut } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import '../component_css/Szerkesztes.css';
import { v4 } from 'uuid'

export const Szerkesztes = () => {

    const navigate = useNavigate();
    const auth = getAuth();
    const { userId } = useParams();
    const [jatekosLista, setJatekosLista] = useState([]);
    const [profilkepFile, setProfilkepFile] = useState(null);


    const [jatekosDocId, setJatekosDocId] = useState("");
    const [jatekosData, setJatekosData] = useState({
        Vezeteknev: "",
        Keresztnev: "",
        Szul_hely_irszam: 0,
        Szul_hely: "",
        Szul_ev: 0,
        Magassag: 0,
        Suly: 0,
        Nemzetiség: "",
        Poszt: "",
        Email: "",
        Telefonszam: "",
    });

    const [profilkepUrl, setProfilkepUrl] = useState("");



    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const q = query(collection(database, "Játékosok"), where("userId", "==", userId));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const docSnapshot = querySnapshot.docs[0];
                    setJatekosDocId(docSnapshot.id);
                    setJatekosData(docSnapshot.data());
                    setProfilkepUrl(docSnapshot.data().ProfilkepUrl);
                }
            } catch (err) {
                console.error(err);
            }
        };


        fetchUserData();
    }, [userId]);

    const navigateToProfil = () => {
        navigate('/checkProfile');
    };

    const navigateToPlayers = () => {
        navigate('/jatekosok');
    };

    const navigateToClubs = () =>{
        navigate(`/klubbok`);
    }

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


    const saveChanges = async (e) => {
        e.preventDefault();

        const confirmed = window.confirm('Biztos vagy benne, hogy el szeretnéd menteni a változásokat?');

        if (!confirmed) {
            return;
        }

        try {
            if (profilkepFile) {
                const storageRef = ref(getStorage(), `Jatekos_profil_kepek/${userId}/${v4()}`);
                await uploadBytes(storageRef, profilkepFile);
                const downloadURL = await getDownloadURL(storageRef);
                setProfilkepUrl(downloadURL);
                setJatekosData({ ...jatekosData, ProfilkepUrl: downloadURL });
            }
            const jatekosDocRef = doc(database, "Játékosok", jatekosDocId);
            await updateDoc(jatekosDocRef, jatekosData);
            navigate('/profil');
        } catch (err) {
            console.error(err);
        }
    };





    return (
        <div className="editPlayer-container">
            <div className="navigation-bar">
                <p className="szilny">Szabadon igazolható labdarúgókat nyilvántartó webes felület</p>
                <button className="playersbutton" onClick={navigateToPlayers}>Igazolható játékosok</button>
                <button className="profilbutton" onClick={navigateToProfil}>Profil</button>
                <button className="profilbutton" onClick={navigateToClubs}>Klubok</button>
                <button className="logOut" onClick={logOut}>Kilépés</button>
            </div>
            <img className="editprofilkep" src={profilkepUrl} alt="Profilkép" />
            <div className="edit-input-container">
                <form onSubmit={saveChanges} encType="multipart/form-data">
                    <table>
                        <tbody>
                        <tr>
                            <td><label>Vezetéknév:</label></td>
                            <td>
                                <input
                                    type="text"
                                    value={jatekosData.Vezeteknev}
                                    onChange={(e) =>
                                        setJatekosData({ ...jatekosData, Vezeteknev: e.target.value })
                                    }
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Keresztnév:</label></td>
                            <td>
                                <input
                                    type="text"
                                    value={jatekosData.Keresztnev}
                                    onChange={(e) =>
                                        setJatekosData({ ...jatekosData, Keresztnev: e.target.value })
                                    }
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>E-mail cím:</label></td>
                            <td>
                                <input
                                    type="text"
                                    value={jatekosData.Email}
                                    onChange={(e) =>
                                        setJatekosData({ ...jatekosData, Email: e.target.value })
                                    }
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Telefonszám:</label></td>
                            <td>
                                <input
                                    type="text"
                                    value={jatekosData.Telefonszam}
                                    onChange={(e) =>
                                        setJatekosData({ ...jatekosData, Telefonszam: e.target.value })
                                    }
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Magasság:</label></td>
                            <td>
                                <input
                                    type="number"
                                    value={jatekosData.Magassag}
                                    onChange={(e) =>
                                        setJatekosData({ ...jatekosData, Magassag: e.target.value })
                                    }
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Súly:</label></td>
                            <td>
                                <input
                                    type="number"
                                    value={jatekosData.Suly}
                                    onChange={(e) =>
                                        setJatekosData({ ...jatekosData, Suly: e.target.value })
                                    }
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Nemzetiség:</label></td>
                            <td>
                                <input
                                    type="text"
                                    value={jatekosData.Nemzetiség}
                                    onChange={(e) =>
                                        setJatekosData({ ...jatekosData, Nemzetiség: e.target.value })
                                    }
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><label>Poszt:</label></td>
                            <td>
                                <select className="dropDownMenu"
                                    value={jatekosData.Poszt}
                                    onChange={(e) =>
                                        setJatekosData({ ...jatekosData, Poszt: e.target.value })
                                    }
                                >
                                    <option value="">Válassz egy posztot...</option>
                                    <option value="Kapus">Kapus</option>
                                    <option value="Védő">Védő</option>
                                    <option value="Középpályás">Középpályás</option>
                                    <option value="Csatár">Csatár</option>
                                    <option value="Támadó középpályás">Támadó középpályás</option>
                                    <option value="Védekező középpályás">Védekező középpályás</option>
                                    <option value="Szélső középpályás">Szélső középpályás</option>
                                </select>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProfilkepFile(e.target.files[0])}
                    />
                    <br/>
                    <button type="submit">Mentés</button>
                </form>
            </div>
            <div>
            </div>
        </div>
    );

}

export default Szerkesztes;
