import React from 'react';
import {Auth} from './auth';
import {AddJatekos} from './addJatekos'
import { useNavigate } from 'react-router-dom';


export function Home() {
    return (
        <div className="App">
            <Auth />
        </div>
    );
}

export default Home;