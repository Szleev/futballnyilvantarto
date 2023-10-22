import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, database } from "../config/firebase-config";

export const CheckUserProfile = () => {
    const navigate = useNavigate();
    const [userHasProfile, setUserHasProfile] = useState(false);

    useEffect(() => {
        const user = auth.currentUser;

        if (user) {
            const jatekosokQuery = query(collection(database, "Játékosok"), where("userId", "==", user.uid));
            getDocs(jatekosokQuery)
                .then((jatekosSnapshot) => {
                    if (!jatekosSnapshot.empty) {
                        const jatekos = jatekosSnapshot.docs[0].data();
                        if (jatekos.isAdmin) {
                            navigate('/admin');
                        } else {
                            setUserHasProfile(true);
                            navigate('/profil');
                        }
                    } else {
                        if (user.isAdmin) {
                            navigate('/admin');
                        } else {
                            const klubokQuery = query(collection(database, "Klubok"), where("KlubId", "==", user.uid));
                            getDocs(klubokQuery)
                                .then((klubokSnapshot) => {
                                    if (!klubokSnapshot.empty) {
                                        const klub = klubokSnapshot.docs[0].data();
                                        if (klub.IsClub) {
                                            navigate('/klubprofil');
                                        } else {
                                            setUserHasProfile(false);
                                            navigate('/uploadData');
                                        }
                                    } else {
                                        setUserHasProfile(false);
                                        navigate('/uploadData');
                                    }
                                })
                                .catch((error) => {
                                    console.error("Hiba a klubok lekérdezése során:", error);
                                });
                        }
                    }
                })
                .catch((error) => {
                    console.error("Hiba a játékosok lekérdezése során:", error);
                });
        }
    }, []);

    return null;
};
