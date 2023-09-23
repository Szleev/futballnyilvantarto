import {useEffect, useState} from "react";
import {addDoc, collection, deleteDoc, doc, getDocs, updateDoc} from "firebase/firestore";
import {auth, database, storage} from "../config/firebase-config";
import {ref, uploadBytes} from "firebase/storage";
import {findAllByDisplayValue} from "@testing-library/react";
import {signOut} from "firebase/auth";


export const AddJatekos = () => {
    const [jatekosLista, setJatekosLista] = useState([])

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
    const [fileUpload, setFileUpload] = useState(null)

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

    const uploadFile = async () =>{
        if (!fileUpload) return;
        const fileFolderRef = ref(storage, `Jatekos_profil_kepek/${fileUpload.name}`);
        try{
            await uploadBytes(fileFolderRef, fileUpload);
        }catch (err){
            console.error(err);
        }
    }
    const logOut = async () => {
        try{
            await signOut(auth);
        } catch (err){
            console.error(err);
        }
    };
    return (
        <div>
            <div>
            <input placeholder="Játékos Keresztneve..." onChange={(e) => setUjJatekosKeresztnev(e.target.value)}/> <input placeholder="Játékos Vezetékneve..." onChange={(e) => setUjJatekosVezeteknev(e.target.value)}/>
            <input placeholder="Születési hely irányítószáma..." type="number" onChange={(e) => setUjIrSzam(Number(e.target.value))}/> <input placeholder="Születésihely neve..." onChange={(e) => setUjSzulHely(e.target.value)}/>
            <input placeholder="Születési év..." type="number" onChange={(e) => setUjSzulEv(Number(e.target.value))}/>
            <input placeholder="Magasság..." type="number" onChange={(e) => setUjMagassag(Number(e.target.value))}/>
            <input placeholder="Súly..." type="number" onChange={(e) => setUjSuly(Number(e.target.value))}/>
            <input placeholder="Nemzetiség..." onChange={(e) => setUjNemzetiseg(e.target.value)}/>
            <input placeholder="Poszt..." onChange={(e) => setUjPoszt(e.target.value)}/>
            <button onClick={adatokBeadasa}>Adatok beadása</button>
        </div>
            <div>
                {jatekosLista.map((jatekos) =>(
                    <div>
                        <h1>Játékos adatai</h1>
                        <p>Név: {jatekos.Vezeteknev} {jatekos.Keresztnev}</p>
                        <p>Születési hely: {jatekos.Szul_hely_irszam}, {jatekos.Szul_hely}</p>
                        <p>Születési év: {jatekos.Szul_ev}</p>
                        <p>Magasság: {jatekos.Magassag}cm</p>
                        <p>Súly: {jatekos.Suly}kg</p>
                        <p>Nemzetiség: {jatekos.Nemzetiség}</p>
                        <p>Poszt: {jatekos.Poszt}</p>
                        <button onClick={() => deleteJatekos(jatekos.id)}>Játékos törlése</button>
                        <input placeholder="Új súly..." onChange={(e) => setUpdatedJatekos(e.target.value)}/>
                        <button onClick={() => updateJatekos(jatekos.id)}>Mentés</button>
                    </div>
                ))}
            </div>
            <div>
                <input type="file" onChange={(e) => setFileUpload(e.target.files[0])}/>
                <button onClick={uploadFile}>Fájl feltöltése</button>
            </div>
            <button onClick={logOut}>Kilépés</button>
        </div>
);
}
export default AddJatekos;
