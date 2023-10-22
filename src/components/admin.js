import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { getDocs, collection } from "firebase/firestore";
import { auth, database } from "../config/firebase-config";
import { getAuth, signOut } from "firebase/auth";
import "../component_css/admin.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faFutbol, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

export const Admin = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [numPlayers, setNumPlayers] = useState(0);
    const [numClubs, setNumClubs] = useState(0);

    const [playersData, setPlayersData] = useState([]);
    const [clubsData, setClubsData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const jatekosCollectionRef = collection(database, "Játékosok");
            const jatekosSnapshot = await getDocs(jatekosCollectionRef);
            const players = jatekosSnapshot.docs.map((doc) => doc.data());

            const normalPlayers = players.filter((player) => player.isAdmin !== true);
            setNumPlayers(normalPlayers.length);

            const klubokCollectionRef = collection(database, "Klubok");
            const klubokSnapshot = await getDocs(klubokCollectionRef);
            setNumClubs(klubokSnapshot.size);

            const playersWithClubs = await Promise.all(
                normalPlayers.map(async (player) => {
                    const leigazolasokCollectionRef = collection(database, "Leigazolasok");
                    const leigazolasokSnapshot = await getDocs(leigazolasokCollectionRef);
                    const leigazolasok = leigazolasokSnapshot.docs.map((doc) => doc.data());

                    const matchingLeigazolas = leigazolasok.find((leigazolas) => leigazolas.userId === player.userId);

                    if (matchingLeigazolas) {
                        const KlubId = matchingLeigazolas.KlubId;
                        player.KlubId = KlubId;
                    }

                    return player;
                })
            );

            setPlayersData(playersWithClubs);

            const clubsCollectionRef = collection(database, "Klubok");
            const clubsSnapshot = await getDocs(clubsCollectionRef);
            const clubs = clubsSnapshot.docs.map((doc) => doc.data());

            const clubsWithLeigazoltSzam = clubs.map((club) => {
                const leigazoltJatekosokSzama = playersWithClubs.filter((player) => player.KlubId === club.KlubId).length;
                return { ...club, leigazoltJatekosokSzama };
            });

            setClubsData(clubsWithLeigazoltSzam);
        };

        fetchData();
    }, []);





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

    const navigateToProfil = () => {
        navigate('/checkProfile');
    };

    const navigateToPlayers = () => {
        navigate('/jatekosok');
    };

    const navigateToClubs = () => {
        navigate('/klubbok');
    };

    return (
        <div className="admin-container">
            <div className="navigation-bar">
                <p className="szilny">Szabadon igazolható labdarúgókat nyilvántartó webes felület ADMIN panel</p>
                <button className="playersbutton" onClick={navigateToPlayers}>Igazolható játékosok</button>
                <button className="profilbutton" onClick={navigateToProfil}>Profil</button>
                <button className="profilbutton" onClick={navigateToClubs}>Klubok</button>
                <button className="logOut" onClick={logOut}>Kilépés</button>
            </div>
            <h1 className="profileh1">Admin felület</h1>
            <div className="register-count">
                <span className="icon-and-count">
                    <FontAwesomeIcon icon={faUser} /> {numPlayers}
                </span>
                <span className="klub-count">
                    <FontAwesomeIcon icon={faFutbol} /> {numClubs}
                </span>
            </div>

            {clubsData.length > 0 && (
                <div className="jatekos-table">
                    <table>
                        <thead>
                        <tr>
                            <th>Művelet</th>
                            <th>Azonosító</th>
                            <th>Profilkép</th>
                            <th>Név</th>
                            <th>Poszt</th>
                            <th>E-mail</th>
                            <th>Telefonszám</th>
                            <th>Magasság</th>
                            <th>Súly</th>
                            <th>Születési hely</th>
                            <th>Klub</th>
                        </tr>
                        </thead>
                        <tbody>
                        {playersData.map((player, index) => (
                            <tr key={index}>
                                <td>
                                    <button onClick={() => navigate(`/szerkesztes/${player.userId}`)} className="gomb">
                                    <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button className="delete">
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                                <td>{player.userId}</td>
                                <td>
                                    <img
                                        src={player.ProfilkepUrl}
                                        alt={`${player.Vezeteknev} ${player.Keresztnev}'s profilkép`}
                                        className="admin-profilkep"
                                    />
                                </td>
                                <td>{`${player.Vezeteknev} ${player.Keresztnev}`}</td>
                                <td>{player.Poszt}</td>
                                <td>{player.Email}</td>
                                <td>{player.Telefonszam}</td>
                                <td>{player.Magassag}cm</td>
                                <td>{player.Suly}kg</td>
                                <td>{`${player.Szul_hely_irszam}, ${player.Szul_hely}`}</td>
                                <td>
                                    {player.KlubId
                                        ? clubsData.find((club) => club.KlubId === player.KlubId)?.Nev || "Ismeretlen klub"
                                        : "-"}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="jatekos-table">
                <table>
                    <thead>
                    <tr>
                        <th>Művelet</th>
                        <th>Azonosító</th>
                        <th>Profilkép</th>
                        <th>Klub név</th>
                        <th>Leigazolt játékosok száma</th>
                    </tr>
                    </thead>
                    <tbody>
                    {clubsData.map((club, index) => (
                        <tr key={index}>
                            <td><button onClick={() => navigate(`/editklub/${club.KlubId}`)} className="gomb">
                                <FontAwesomeIcon icon={faEdit} />
                            </button>
                                <br/>
                                <button className="delete">
                                    <FontAwesomeIcon icon={faTrash} />
                                </button></td>
                            <td>{club.KlubId}</td>
                            <td>
                                <img
                                    src={club.KepUrl}
                                    className="admin-profilkep"
                                />
                            </td>
                            <td>{club.Nev}</td>
                            <td>{club.leigazoltJatekosokSzama}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default Admin;
