import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css';
import { Home, Room, Game, Result } from "./pages"

const App = () => {
  return(
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/room/*" element={<Room />} />
        <Route path="/game/*" element={<Game />} />
        <Route path="/result/" element={<Result />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
