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
            </Routes>
        </Router>


    );
}

export default App;
