import React from 'react';
import './navbar.css';
import {useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose}) => {
  const navigate = useNavigate();
  if (!isOpen) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('userName');
    document.cookie = 'token=; Max-Age=0; path=/;';
    navigate('/login');
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <button onClick={onClose} className="close-btn">Fermer</button>
      <div className="sidebar-content">
        <a href="/profile" className="sidebar-item">Profil</a>
        <a onClick={handleLogout} className="sidebar-item">Se déconnecter</a>
        <a href="/about" className="sidebar-item">À propos</a>
      </div>
    </div>
  );
};

export default Sidebar;
