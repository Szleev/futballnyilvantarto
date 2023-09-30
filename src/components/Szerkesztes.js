import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { auth, database } from "../config/firebase-config";
import { getAuth, signOut } from "firebase/auth";
import '../component_css/Szerkesztes.css';
import transition from "../transition";

export const Szerkesztes = () => {

    const navigate = useNavigate();
    const auth = getAuth();


    const [vezeteknev, setVezeteknev] = useState('');
    const [keresztnev, setKeresztnev] = useState('');
    const [email, setEmail] = useState('');
    const [telefonszam, setTelefonszam] = useState('');
    //const [szuletesihely, setSzuletesiHely] = useState('');
    //const [szulhelyirszam, setSzulHelyIrszam] = useState('');
    //const [szulev, setSzulEv] = useState('');
    const [magassag, setMagassag] = useState('');
    const [suly, setSuly] = useState('');
    const [nemzetiseg, setNemzetiség] = useState('');
    const [poszt, setPoszt] = useState('');

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setVezeteknev(currentUser.Vezeteknev || '');
            setKeresztnev(currentUser.Keresztnev || '');
            setEmail(currentUser.Email || '');
            setTelefonszam(currentUser.Telefonszam || '');
            //setSzuletesiHely(jatekos.Szul_hely);
            //setSzulHelyIrszam(jatekos.Szul_hely_irszam);
            //setSzulEv(jatekos.Szul_ev);
            setMagassag(currentUser.Magassag || '');
            setSuly(currentUser.Suly || '');
            setNemzetiség(currentUser.Nemzetiség || '');
            setPoszt(currentUser.Poszt || '');

            const getJatekosData = async () => {
                const jatekosDocRef = doc(database, "Játékosok", currentUser.uid);
                try {
                    const jatekosDoc = await getDoc(jatekosDocRef);

                    if (jatekosDoc.exists()) {
                        const jatekosData = jatekosDoc.data();
                        setVezeteknev(jatekosData.Vezeteknev || '');
                        setKeresztnev(jatekosData.Keresztnev || '');
                        setEmail(jatekosData.Email || '');
                        setTelefonszam(jatekosData.Telefonszam || '');
                        setMagassag(jatekosData.Magassag || '');
                        setSuly(jatekosData.Magassag || '');
                        setNemzetiség(jatekosData.Nemzetiség || '');
                        setPoszt(jatekosData.Poszt);
                    } else {
                        console.log("A játékos dokumentum nem található.");
                    }
                } catch (error) {
                    console.error("Hiba a játékos adatok lekérdezése közben:", error);
                }
            };

            getJatekosData();
        }
    }, [auth]);

    const navigateToProfil = () => {
        navigate('/checkProfile');
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("fut a kezelő");
        console.log("Az aktuális felhasználó azonosítója:", auth.currentUser.uid);
        try {

            const jatekosDocRef = doc(database, "Játékosok", auth.currentUser.uid);
            const dataToUpdate = {
                Vezeteknev: vezeteknev,
                Keresztnev: keresztnev,
                Email: email,
                Telefonszam: telefonszam,
                Magassag: magassag,
                Suly: suly,
                Nemzetiség: nemzetiseg,
                Poszt: poszt

            };
            await updateDoc(jatekosDocRef, dataToUpdate);

            navigate('/profil');
        } catch (error) {
            console.error(error);
        }
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
            <form onSubmit={handleSubmit}>
                <label>Vezetéknév:</label>
                <input
                    type="text"
                    value={vezeteknev}
                    onChange={(e) => setVezeteknev(e.target.value)}
                />
                <label>Keresztnév:</label>
                <input
                    type="text"
                    value={keresztnev}
                    onChange={(e) => setKeresztnev(e.target.value)}
                />
                <label>E-mail:</label>
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label>Telefonszám:</label>
                <input
                    type="number"
                    value={telefonszam}
                    onChange={(e) => setTelefonszam(e.target.value)}
                />
                <label>Magasság:</label>
                <input
                    type="number"
                    value={magassag}
                    onChange={(e) => setMagassag(e.target.value)}
                />
                <label>Súly:</label>
                <input
                    type="number"
                    value={suly}
                    onChange={(e) => setSuly(e.target.value)}
                />
                <label>Nemzetiség:</label>
                <input
                    type="text"
                    value={nemzetiseg}
                    onChange={(e) => setNemzetiség(e.target.value)}
                />
                <label>Poszt:</label>
                <input
                    type="text"
                    value={poszt}
                    onChange={(e) => setPoszt(e.target.value)}
                />
                <button type="submit">Mentés</button>
            </form>
        </div>
    );
}

export default Szerkesztes;
