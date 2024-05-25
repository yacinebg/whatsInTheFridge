import React from 'react';
import './navbar.css';
import logo_home from "./assets/logo.png"; 
import { FaUserCircle } from "react-icons/fa";

const Navbar = ({onUserClick, userProfilePic}) => {

  return (
    <div className="navbar">
      <div className="navbar-content">
        <div className="nav-items">
          <a href="/home" className="nav-item nav-item-home">Accueil</a> 
          <a href="/explore" className="nav-item">Explorer</a>
        </div>
        <a href="/home" className="logo-link">
          <img src={logo_home} alt="Logo" className="logo_home"/>
        </a>
        <div className="user-info" onClick={onUserClick}>
          {userProfilePic 
            ? <img src={userProfilePic} alt="Profile" className="profile-icon"/>
            : <FaUserCircle size={40} className="profile-icon" />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
