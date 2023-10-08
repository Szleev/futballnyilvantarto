import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { auth, database } from "../config/firebase-config";
import { getAuth, signOut } from "firebase/auth";
import "../component_css/browsePlayers.css";

export const Jatekosok = () => {

    const navigate = useNavigate();
    const auth = getAuth();
    const [jatekosok, setJatekosok] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");


    useEffect(() => {
        const fetchJatekosok = async () => {
            try {
                const jatekosCollectionRef = collection(database, "Játékosok");
                const jatekosSnapshot = await getDocs(jatekosCollectionRef);
                const jatekosokData = [];

                const leigazolasokCollectionRef = collection(database, "Leigazolasok");
                const leigazolasokSnapshot = await getDocs(leigazolasokCollectionRef);

                const leigazoltUserIds = leigazolasokSnapshot.docs.map((doc) => doc.data().userId);

                jatekosSnapshot.forEach((doc) => {
                    const jatekosData = doc.data();

                    if (!leigazoltUserIds.includes(jatekosData.userId)) {
                        jatekosokData.push(jatekosData);
                    }
                });

                setJatekosok(jatekosokData);
            } catch (error) {
                console.error("Hiba a játékosok lekérdezése közben:", error);
            }
        };

        fetchJatekosok();
    }, []);

    const filteredJatekosok = jatekosok.filter((jatekos) => {
        const nev = `${jatekos.Vezeteknev} ${jatekos.Keresztnev}`.toLowerCase();
        const poszt = jatekos.Poszt.toLowerCase();
        const search = searchTerm.toLowerCase();

        return nev.includes(search) || poszt.includes(search);
    });


    const navigateToProfil = () => {
        navigate("/profil");
    };

    const navigateToDetails = (userId) => {
        navigate(`/reszletek/${userId}`);

    };
    const navigateToPlayers = () => {
        navigate("/jatekosok");
    };
    const navigateToClubs = () =>{
        navigate(`/klubbok`);
    }

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
        <div className="jatekos-container">
            <div className="navigation-bar">
                <p className="szilny">Szabadon igazolható labdarúgókat nyilvántartó webes felület</p>
                <button className="playersbutton" onClick={navigateToPlayers}>Igazolható játékosok</button>
                <button className="profilbutton" onClick={navigateToProfil}>Profil</button>
                <button className="profilbutton" onClick={navigateToClubs}>Klubok</button>
                <button className="logOut" onClick={logOut}>Kilépés</button>
            </div>
            <h1 className="profileh1">Igazolható játékosok</h1>
            <input
                className="search-bar"
                type="text"
                placeholder="Keresés név vagy poszt alapján..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="jatekos-list">
                {filteredJatekosok.length === 0 ? (
                    <p className="no-result">Nincs találat a keresésre...</p>
                ) : (
                    filteredJatekosok.map((jatekos) => (
                        <div key={jatekos.userId} className="jatekos-card">
                            <img
                                className="jatekos-card-profilkep"
                                src={jatekos.ProfilkepUrl}
                                alt={`${jatekos.Vezeteknev} ${jatekos.Keresztnev}`}
                            />
                            <h2>{`${jatekos.Vezeteknev} ${jatekos.Keresztnev}`}</h2>
                            <p>{jatekos.Poszt}</p>
                            <button onClick={() => navigateToDetails(jatekos.userId)}>Játékos részletei</button>
                        </div>
                    ))
                )}
            </div>

        </div>
    );

};

export default Jatekosok;
