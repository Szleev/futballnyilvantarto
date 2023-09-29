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
    const [ujEmail, setUjEmail] = useState("");
    const [ujTelefonszam, setUjTelefonszam] = useState("");

    //Fájl feltöltése
    const [imageUpload, setImageUpload] = useState(null)
    const [imageList,setImageList] = useState([])
    const imageListRef = ref(storage, "Jatekos_profil_kepek/")
    const [isUploadSuccess, setIsUploadSuccess] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const jatekosCollectionRef = collection(database,"Játékosok")


    const uploadFile = async () => {
        if (!imageUpload) {
            alert('Válassz ki egy fájlt a feltöltéshez!');
            return;
        }

        const user = auth.currentUser;

        if (!user) {
            console.error('Nincs bejelentkezett felhasználó.');
            return;
        }

        const fileFolderRef = ref(
            storage,
            `Jatekos_profil_kepek/${user.uid}/${imageUpload.name + v4()}`
        );

        try {
            const userImageRefs = await listAll(
                ref(storage, `Jatekos_profil_kepek/${user.uid}`)
            );

            const snapshot = await uploadBytes(fileFolderRef, imageUpload);
            const url = await getDownloadURL(snapshot.ref);

            await Promise.all(
                userImageRefs.items.map(async (item) => {
                    await deleteObject(item);
                })
            );

            setIsUploadSuccess(true);
            setTimeout(() => {
                setIsUploadSuccess(false);
            }, 3000);

            setImageList([url]);
        } catch (err) {
            console.error(err);
        }
    };


    const getJatekosLista = async () => {
        try {
            const data = await getDocs(jatekosCollectionRef);
            const filteredData= data.docs.map((doc) => ({...doc.data(), id: doc.id}))
            setJatekosLista(filteredData)
        } catch (err) {
            console.error(err);
        }
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


    const adatokBeadasa = async () => {
        if (
            ujJatekosVezeteknev &&
            ujJatekosKeresztnev &&
            ujIrSzam !== null &&
            ujSzulHely &&
            ujSzulEv !== null &&
            ujMagassag !== null &&
            ujSuly !== null &&
            ujNemzetiseg &&
            ujPoszt &&
            imageUpload !== null &&
            ujEmail && // Hozzáadott email mező ellenőrzése
            ujTelefonszam // Hozzáadott telefonszám mező ellenőrzése
        ) {
            const confirmed = window.confirm('Biztosan mented az adatokat?');
            if (confirmed) {
                try {
                    if (imageUpload) {
                        const user = auth.currentUser;

                        if (!user) {
                            console.error("Nincs bejelentkezett felhasználó.");
                            return;
                        }

                        const fileFolderRef = ref(storage, `Jatekos_profil_kepek/${user.uid}/${imageUpload.name + v4()}`);

                        const snapshot = await uploadBytes(fileFolderRef, imageUpload);
                        const profilkepUrl = await getDownloadURL(snapshot.ref);

                        const jatekosData = {
                            Vezeteknev: ujJatekosVezeteknev,
                            Keresztnev: ujJatekosKeresztnev,
                            Szul_hely_irszam: ujIrSzam,
                            Szul_hely: ujSzulHely,
                            Szul_ev: ujSzulEv,
                            Magassag: ujMagassag,
                            Suly: ujSuly,
                            Nemzetiség: ujNemzetiseg,
                            Poszt: ujPoszt,
                            Email: ujEmail,
                            Telefonszam: ujTelefonszam,
                            userId: auth?.currentUser.uid,
                            ProfilkepUrl: imageList[0]
                        };

                        await addDoc(jatekosCollectionRef, jatekosData);
                        navigate('/profil');
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        } else {
            alert('Minden mezőt ki kell tölteni, és egy profilképet is fel kell tölteni!');
        }
    };






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
    const handleOptionChange = (e) => {
        setUjPoszt(e.target.value);
    };
    const navigateToProfil = () => {
        navigate('/checkProfile');
    };
    const navigateToPlayers = () => {
        navigate('/jatekosok');
    };
    return (
        <div className="data-container">
            <div className="navigation-bar">
                <button className="playersbutton" onClick={navigateToPlayers}>Igazolható játékosok</button>
                <button className="profilbutton" onClick={navigateToProfil}>Profil</button>
                <button className="logOut" onClick={logOut}>Kilépés</button>
            </div>
            <h1 className="profileh1">Regisztrálja adatait!</h1>
            <div className="input-container">
            <input placeholder="Keresztnév..." onChange={(e) => setUjJatekosKeresztnev(e.target.value)} required />
            <input placeholder="Vezetéknév..." onChange={(e) => setUjJatekosVezeteknev(e.target.value)} required />
            <input placeholder="Születési hely irányítószáma..." type="number" onChange={(e) => setUjIrSzam(Number(e.target.value))} required />
            <input placeholder="Születésihely neve..." onChange={(e) => setUjSzulHely(e.target.value)} required />
            <input placeholder="Születési év..." type="number" onChange={(e) => setUjSzulEv(Number(e.target.value))} required />
            <input placeholder="Magasság..." type="number" onChange={(e) => setUjMagassag(Number(e.target.value))} required />
            <input placeholder="Súly..." type="number" onChange={(e) => setUjSuly(Number(e.target.value))} required />
            <input placeholder="Nemzetiség..." onChange={(e) => setUjNemzetiseg(e.target.value)} required />
            <input placeholder="E-mail..." onChange={(e) => setUjEmail(e.target.value)} required />
            <input placeholder="Telefonszám..." onChange={(e) => setUjTelefonszam(e.target.value)} required />
            <select className="dropDownMenu" value={ujPoszt} onChange={handleOptionChange} required>
                <option value="">Válassz egy posztot...</option>
                <option value="Kapus">Kapus</option>
                <option value="Védő">Védő</option>
                <option value="Középpályás">Középpályás</option>
                <option value="Csatár">Csatár</option>
                <option value="Támadó középpályás">Támadó középpályás</option>
                <option value="Védekező középpályás">Védekező középpályás</option>
                <option value="Szélső középpályás">Szélső középpályás</option>
            </select>
        </div>



    <div className="image-container">
                <h2>Profilkép feltöltése</h2>
                <input type="file" onChange={(e) => setImageUpload(e.target.files[0])} />
                <button onClick={uploadFile}>Fájl feltöltése</button>
                {isUploadSuccess && (
                    <p className="success-message fade-out">Sikeres feltöltés</p>
                )}
            </div>
            <button className="save" onClick={adatokBeadasa}>Adatok mentése</button>

        </div>
);
}
export default AddJatekos;
