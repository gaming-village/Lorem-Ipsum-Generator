import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from '../pages/Home';
import Malware from '../pages/Malware';

import Game from '../Game';
import PrestigeTree from '../pages/PrestigeTree';

const Main = () => {
   useEffect(() => {
      // Calculates the lorem made by workers while away and adds it to the lorem count
      Game.calculateIdleProfits();
   }, []);

   return (
      <Routes>{/* The Switch decides which component to show based on the current URL.*/}
         <Route path='/' element={<Home />}></Route>
         <Route path='/Lorem-Ipsum-Generator' element={<Home />}></Route>
         <Route path='/malware' element={<Malware />}></Route>
         <Route path="/prestige-tree" element = {<PrestigeTree />}></Route>
      </Routes>
   );
}

export default Main; 