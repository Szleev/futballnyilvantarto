import {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import {addDoc, collection, deleteDoc, doc, getDocs, updateDoc} from "firebase/firestore";
import {auth, database, storage} from "../config/firebase-config";
import {ref, uploadBytes, listAll, getDownloadURL, deleteObject} from "firebase/storage";
import {findAllByDisplayValue} from "@testing-library/react";
import {getAuth, signOut} from "firebase/auth";
import '../component_css/addJatekos.css'
import {v4} from 'uuid'
import * as url from "url";
export const AddJatekos = () => {
    const [jatekosLista, setJatekosLista] = useState([])
    const auth = getAuth();
    const navigate = useNavigate();
    const [isDialogOpen, setDialogOpen] = useState(false);

    //Új játékos hozzáadása
    const [ujJatekosVezeteknev, setUjJatekosVezeteknev] = useState("");
    const [ujJatekosKeresztnev, setUjJatekosKeresztnev] = useState("");
    const [ujIrSzam, setUjIrSzam] = useState(0);
    const [ujSzulHely, setUjSzulHely] = useState("");
    const [ujSzulEv, setUjSzulEv] = useState(0);
    const [ujMagassag, setUjMagassag] = useState(0);
    const [ujSuly, setUjSuly] = useState(0);
    const [ujNemzetiseg, setUjNemzetiseg] = useState("");
    const [ujPoszt, setUjPoszt] = useState("");


    //Update Játékos
    const [updatedJatekos, setUpdatedJatekos] = useState("")

    //Fájl feltöltése
    const [imageUpload, setImageUpload] = useState(null)
    const [imageList,setImageList] = useState([])
    const imageListRef = ref(storage, "Jatekos_profil_kepek/")

    const jatekosCollectionRef = collection(database,"Játékosok")

    const getJatekosLista = async () => {
        try {
            const data = await getDocs(jatekosCollectionRef);
            const filteredData= data.docs.map((doc) => ({...doc.data(), id: doc.id}))
            setJatekosLista(filteredData)
        } catch (err) {
            console.error(err);
        }
    }

    const deleteJatekos = async (id) =>{
        const jatekosDoc = doc(database, "Játékosok", id)
        await deleteDoc(jatekosDoc);
        getJatekosLista();
    }

    const updateJatekos = async (id,) =>{
        const jatekosDoc = doc(database, "Játékosok", id)
        await updateDoc(jatekosDoc,{Suly: updatedJatekos});
        getJatekosLista();
    }

    useEffect(() => {
        listAll(imageListRef).then((response) => {
            response.items.forEach((item) =>{
                getDownloadURL(item).then((url) =>{
                    setImageList((prev) => [...prev, url]);
                })
            })
        });
        getJatekosLista();
    }, []);


    const adatokBeadasa = async () =>{
        try{
            await addDoc(jatekosCollectionRef, {
                Vezeteknev: ujJatekosVezeteknev,
                Keresztnev: ujJatekosKeresztnev,
                Szul_hely_irszam: ujIrSzam,
                Szul_hely: ujSzulHely,
                Szul_ev: ujSzulEv,
                Magassag: ujMagassag,
                Suly: ujSuly,
                Nemzetiség: ujNemzetiseg,
                Poszt: ujPoszt,
                userId: auth?.currentUser.uid,
            })
            getJatekosLista();
        } catch (err) {
            console.error(err)
        }
    }

    const uploadFile = async () => {
        if (!imageUpload) return;
        const user = auth.currentUser;

        if (!user) {
            console.error("Nincs bejelentkezett felhasználó.");
            return;
        }

        const fileFolderRef = ref(storage, `Jatekos_profil_kepek/${user.uid}/${imageUpload.name + v4()}`);

        try {
            const userImageRefs = await listAll(ref(storage, `Jatekos_profil_kepek/${user.uid}`));

            const snapshot = await uploadBytes(fileFolderRef, imageUpload);
            const url = await getDownloadURL(snapshot.ref);

            await Promise.all(userImageRefs.items.map(async (item) => {
                await deleteObject(item);
            }));

            setImageList([url]);
        } catch (err) {
            console.error(err);
        }
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
    return (
        <div className="jatekos-container">
            <div className="navigation-bar">
                <button className="playersbutton">Igazolható játékosok</button>
                <button className="clubbutton">Klubbok</button>
                <button className="profilbutton">Profil</button>
                <button className="logOut" onClick={logOut}>Kilépés</button>
            </div>
            <h1 className="profileh1">Profil</h1>
            <div className="input-container">
            <input placeholder="Játékos Keresztneve..." onChange={(e) => setUjJatekosKeresztnev(e.target.value)}/> <input placeholder="Játékos Vezetékneve..." onChange={(e) => setUjJatekosVezeteknev(e.target.value)}/>
            <input placeholder="Születési hely irányítószáma..." type="number" onChange={(e) => setUjIrSzam(Number(e.target.value))}/> <input placeholder="Születésihely neve..." onChange={(e) => setUjSzulHely(e.target.value)}/>
            <input placeholder="Születési év..." type="number" onChange={(e) => setUjSzulEv(Number(e.target.value))}/>
            <input placeholder="Magasság..." type="number" onChange={(e) => setUjMagassag(Number(e.target.value))}/>
            <input placeholder="Súly..." type="number" onChange={(e) => setUjSuly(Number(e.target.value))}/>
            <input placeholder="Nemzetiség..." onChange={(e) => setUjNemzetiseg(e.target.value)}/>
            <input placeholder="Poszt..." onChange={(e) => setUjPoszt(e.target.value)}/>
            <button onClick={adatokBeadasa}>Adatok mentése</button>
        </div>
            {imageList.map((url) =>{
                return <img src={url}/>
            })}
            <div>
                {jatekosLista.map((jatekos) =>(
                    <div className="adatok-container">
                        <table>
                            <tbody>
                            <tr>
                                <th colSpan="2"><h1>Saját adataim</h1></th>
                            </tr>
                            <tr>
                                <td><h2>Név:</h2></td>
                                <td><p>{jatekos.Vezeteknev} {jatekos.Keresztnev}</p></td>
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
                            </tbody>
                        </table>

                        <button onClick={() => deleteJatekos(jatekos.id)}>Profil törlése</button>
                        <input placeholder="Új súly..." onChange={(e) => setUpdatedJatekos(e.target.value)}/>
                        <button onClick={() => updateJatekos(jatekos.id)}>Mentés</button>
                    </div>
                ))}
            </div>
            <div className="image-container">
                <h2>Profilkép feltöltése</h2>
                <input type="file" onChange={(e) => setImageUpload(e.target.files[0])}/>
                <button onClick={uploadFile}>Fájl feltöltése</button>

            </div>

        </div>
);
}
export default AddJatekos;
