import React from 'react';
import './App.css'; 
import { useNavigate } from 'react-router-dom';
import logo from "./assets/logo.png";
import fond from "./assets/fond2.webp";

function Authentifacation() {
  const navigate = useNavigate();
  
  const handeledLogin =() =>{
    navigate('/login');
  }

  const handeledSign =() =>{
    navigate('/signup');
  }

    return (
      <div className="app">
        <div className="left">
          <div className='solo'>
          <img id="logo" src={logo} alt="What's in the Fridge Logo" className="logo" />
          </div>
          <div className="content">
              <button className="button1 signup" onClick={handeledLogin}>SE CONNECTER</button>
              <button className="button1 login" onClick={handeledSign} >S'INSCRIRE</button>
          </div>
        </div>
        <div className='right'>
          <img src={fond} alt="Fridge Full of Food" className="background" />
        </div>
      </div>
    );
  }
  
  export default Authentifacation;