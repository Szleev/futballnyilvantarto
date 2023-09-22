import {auth, googleprovider} from "../config/firebase-config";
import {createUserWithEmailAndPassword, signInWithPopup, signOut} from 'firebase/auth'
import {useState} from "react";

export const Auth = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signIn = async () => {
        try{
            await createUserWithEmailAndPassword(auth,email,password);
        } catch (err){
            console.error(err);
        }
    };
    const signInWithGoogle = async () => {
        try{
            await signInWithPopup(auth, googleprovider);
        } catch (err){
            console.error(err);
        }
    };

    const logOut = async () => {
        try{
            await signOut(auth);
        } catch (err){
            console.error(err);
        }
    };

    return (<div>
            <input placeholder={"E-mail..."} onChange={(e) => setEmail(e.target.value)}/>
            <input placeholder={"Jelszó..."} type="password" onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={signIn}>Belépés</button>

            <button onClick={signInWithGoogle}>Belépés Google fiókkal</button>
            <button onClick={logOut}>Kilépés</button>
    </div>
    );
};