import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AddJatekos } from "./components/addJatekos";
import { Home } from "./components/Home";
import { Profil } from "./components/Profil";
import { Jatekosok } from "./components/browsePlayers";
import { CheckUserProfile } from "./components/CheckUserProfile";
import { Szerkesztes } from "./components/Szerkesztes";
import {AnimatePresence} from "framer-motion"
import PlayerDetails from "./components/playerDetails";

function App() {
    return (

            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/uploadData" element={<AddJatekos />} />
                    <Route path="/profil" element={<Profil />} />
                    <Route path="/jatekosok" element={<Jatekosok />} />
                    <Route path="/checkProfile" element={<CheckUserProfile />} />
                    <Route path="/szerkesztes" element={<Szerkesztes />} />
                    <Route path="/reszletek/:playerId" element={<PlayerDetails />} />

                </Routes>
            </Router>

    );
}

export default App;
