import {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import {addDoc, collection, deleteDoc, doc, getDocs, updateDoc} from "firebase/firestore";
import {auth, database, storage} from "../config/firebase-config";
import {ref, uploadBytes, listAll, getDownloadURL, deleteObject} from "firebase/storage";
import {findAllByDisplayValue} from "@testing-library/react";
import {getAuth, signOut} from "firebase/auth";
import '../component_css/browsePlayers.css'
import {v4} from 'uuid'
import * as url from "url";



export const Jatekosok = () =>{


    const navigate = useNavigate();

    const navigateToProfil = () => {
        navigate('/checkProfile');
    };
    const navigateToPlayers = () => {
        navigate('/jatekosok');
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

    return(
        <div className="jatekos-container">
            <div className="navigation-bar">
                <button className="playersbutton" onClick={navigateToPlayers}>Igazolható játékosok</button>
                <button className="profilbutton" onClick={navigateToProfil}>Profil</button>
                <button className="logOut" onClick={logOut}>Kilépés</button>
            </div>
        </div>
    );
}

export default Jatekosok;
