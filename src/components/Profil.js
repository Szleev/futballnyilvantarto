import {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import {addDoc, collection, deleteDoc, doc, getDocs, updateDoc, query, where} from "firebase/firestore";
import {auth, database, storage} from "../config/firebase-config";
import {ref, uploadBytes, listAll, getDownloadURL, deleteObject} from "firebase/storage";
import {findAllByDisplayValue} from "@testing-library/react";
import {getAuth, signOut} from "firebase/auth";
import '../component_css/Profil.css'
import {v4} from 'uuid'
import * as url from "url";
import transition from "../transition";
import {Szerkesztes} from "./Szerkesztes";



export const Profil = () =>{


    const navigate = useNavigate();
    const [jatekosLista, setJatekosLista] = useState([]);
    const jatekosCollectionRef = collection(database,"Játékosok")
    const user = auth.currentUser;
    const userId = user ? user.uid : null;

    useEffect(() => {
        const fetchJatekosLista = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const q = query(collection(database, "Játékosok"), where("userId", "==", user.uid));
                    const data = await getDocs(q);
                    if (!data.empty) {
                        const jatekosok = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
                        setJatekosLista(jatekosok);
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchJatekosLista();
    }, []);
    const getJatekosLista = async () => {
        try {
            const data = await getDocs(jatekosCollectionRef);
            const filteredData= data.docs.map((doc) => ({...doc.data(), id: doc.id}))
            setJatekosLista(filteredData)
        } catch (err) {
            console.error(err);
        }
    }

    const navigateToProfil = () => {
        navigate('/checkProfile');
    };
    const navigateToPlayers = () => {
        navigate('/jatekosok');
    };
    const navigateToEdit = (userId) =>{
        navigate(`/szerkesztes/${userId}`);
    }


    const logOut = async () => {
        const confirmed = window.confirm('Biztosan ki szeretnél lépni?');
        if (confirmed){
            try{
                await signOut(auth);
                navigate('/');
            } catch (err){
                console.error(err);
            }
        }
    };



    const deleteJatekos = async (id, profilképUrl) => {
        const confirmed = window.confirm('Biztosan törlöd a profilod?');
        if (confirmed) {
            const jatekosDoc = doc(database, "Játékosok", id);
            try {
                await deleteDoc(jatekosDoc);
                if (profilképUrl) {
                    const storageRef = ref(storage, profilképUrl);
                    await deleteObject(storageRef);
                }
                setJatekosLista((prevJatekosok) => prevJatekosok.filter(jatekos => jatekos.id !== id));
            } catch (err) {
                console.error(err);
            }
            navigate('/uploadData')
        }
    };



    return(
        <div className="profil-container">
            <div className="navigation-bar">
                <button className="playersbutton" onClick={navigateToPlayers}>Igazolható játékosok</button>
                <button className="profilbutton" onClick={navigateToProfil}>Profil</button>
                <button className="logOut" onClick={logOut}>Kilépés</button>
            </div>
            <div>
                {jatekosLista.map((jatekos) => (
                    <div className="adatok-container" key={jatekos.id}>
                        <div className="profilkep">
                            <img src={jatekos.ProfilkepUrl} alt={`${jatekos.Vezeteknev} ${jatekos.Keresztnev} profilkép`} />
                        </div>
                        <table className="adatTable">
                            <tbody>
                            <tr>
                                <td><h2>Név:</h2></td>
                                <td><p>{jatekos.Vezeteknev} {jatekos.Keresztnev}</p></td>
                            </tr>
                            <tr>
                                <td><h2>E-mail:</h2></td>
                                <td><p>{jatekos.Email}</p></td>
                            </tr>
                            <tr>
                                <td><h2>Telefonszám:</h2></td>
                                <td><p>{jatekos.Telefonszam}</p></td>
                            </tr>
                            <tr>
                                <td><h2>Születési hely:</h2></td>
                                <td><p>{jatekos.Szul_hely_irszam}, {jatekos.Szul_hely}</p></td>
                            </tr>
                            <tr>
                                <td><h2>Születési év:</h2></td>
                                <td><p>{jatekos.Szul_ev}</p></td>
                            </tr>
                            <tr>
                                <td><h2>Magasság:</h2></td>
                                <td><p>{jatekos.Magassag}cm</p></td>
                            </tr>
                            <tr>
                                <td><h2>Súly:</h2></td>
                                <td><p>{jatekos.Suly}kg</p></td>
                            </tr>
                            <tr>
                                <td><h2>Nemzetiség:</h2></td>
                                <td><p>{jatekos.Nemzetiség}</p></td>
                            </tr>
                            <tr>
                                <td><h2>Poszt:</h2></td>
                                <td><p>{jatekos.Poszt}</p></td>
                            </tr>
                            <tr>
                                <td><h2>Egyéni profil azonosító:</h2></td>
                                <td><p>{jatekos.userId}</p></td>
                            </tr>
                            </tbody>
                        </table>
                        <div className="updateData">
                            <button className="deleteButton" onClick={() => deleteJatekos(jatekos.id)}>Profil törlése</button>
                            <br/>
                            <button className="editButton" onClick={() => navigateToEdit(userId)}>Szerkesztés</button>
                        </div>

                    </div>
                ))}
            </div>


        </div>
    );
}

export default Profil;
