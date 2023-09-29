import React from 'react';
import {AddJatekos} from "./components/addJatekos";
import {Home} from "./components/Home";
import {} from "./components/auth";
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Profil from "./components/Profil";
import Jatekosok from "./components/browsePlayers";
import {CheckUserProfile} from "./components/CheckUserProfile";

function App() {

  return (
      <Router>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/uploadData" element={<AddJatekos />} />
              <Route path="/profil" element={<Profil />} />
              <Route path="/jatekosok" element={<Jatekosok />} />
              <Route path="/checkProfile" element={<CheckUserProfile />} />
          </Routes>
      </Router>
  );
}

export default App;
