import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth , database} from "../config/firebase-config";

export const CheckUserProfile = () => {
    const navigate = useNavigate();
    const [userHasProfile, setUserHasProfile] = useState(false);

    useEffect(() => {
        const user = auth.currentUser;

        if (user) {

            const q = query(collection(database, "Játékosok"), where("userId", "==", user.uid));

            getDocs(q)
                .then((querySnapshot) => {
                    if (!querySnapshot.empty) {

                        setUserHasProfile(true);
                        navigate('/profil');
                    } else {
                        // Ha nincs találat, nincs profil
                        setUserHasProfile(false);
                        navigate('/uploadData');
                    }
                })
                .catch((error) => {
                    console.error("Hiba a lekérdezés során:", error);
                });
        }
    }, []);



    return null;
};
