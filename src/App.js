import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AddJatekos } from "./components/addJatekos";
import { Home } from "./components/Home";
import { Profil } from "./components/Profil";
import { Jatekosok } from "./components/browsePlayers";
import { CheckUserProfile } from "./components/CheckUserProfile";
import { Szerkesztes } from "./components/Szerkesztes";
import {AnimatePresence} from "framer-motion"
import PlayerDetails from "./components/playerDetails";
import Klubbok from "./components/Klubbok";
import AddKlub from "./components/addKlub";
import KlubProfil from "./components/klubProfil";
import EditKlub from "./components/EditKlub";
import KlubDetails from "./components/klubDetails";
import LeigazoltJatekosok from "./components/LeigazoltJatekosok";

function App() {
    return (

        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/uploadData" element={<AddJatekos />} />
                <Route path="/profil" element={<Profil />} />
                <Route path="/jatekosok" element={<Jatekosok />} />
                <Route path="/checkProfile" element={<CheckUserProfile />} />
                <Route path="/szerkesztes/:userId" element={<Szerkesztes />} />
                <Route path="/reszletek/:playerId" element={<PlayerDetails />} />
                <Route path="/klubbok" element={<Klubbok />} />
                <Route path="/addKlub" element={<AddKlub />} />
                <Route path="/klubprofil" element={<KlubProfil />} />
                <Route path="/editklub/:KlubId" element={<EditKlub />} />
                <Route path="/klubreszletek/:KlubId" element={<KlubDetails />} />
                <Route path="/igazolasok/:KlubId" element={<LeigazoltJatekosok />} />

            </Routes>
        </Router>


    );
}

export default App;
