import logo from './logo.svg';
import React from 'react';
import {Auth} from "./components/auth";
import {AddJatekos} from "./components/addJatekos";
import {Home} from "./components/Home";
import {} from "./components/auth";
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

function App() {

  return (
      <Router>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/addjatekos" element={<AddJatekos />} />
          </Routes>
      </Router>
  );
}

export default App;
