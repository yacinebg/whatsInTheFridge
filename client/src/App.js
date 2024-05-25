import React from 'react';
import './App.css'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Authentifacation from "./Authentifacation.js";
import Login from "./Login.js";
import Sign from "./Sign.js";
import Home from "./Home.js";
import Explorer from './Explorer.js';
import Profile from './Profile.js';
import RecipeDetail from './RecipeDetail';
import About from './About';

function App() {
  return (
    <Router>
    <div className="main">
      <Routes>
        <Route path="/" element={<Authentifacation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Sign />} />
        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explorer />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/about" element={<About />}/>
        <Route path="/recipe/:id" element={<RecipeDetail />} /> 
      </Routes>
    </div> 
  </Router>
  );
}

export default App;
