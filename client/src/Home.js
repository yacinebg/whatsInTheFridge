import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; 
import BannerCarousel from './BannerCarousel.js';
import Layout from './Layout.js';

const Home = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    const token = tokenCookie ? tokenCookie.split('=')[1] : null;
    
    if (!storedUserName || !token) {
      navigate('/login');
    } else {
      verifyToken(token, storedUserName);
    }
  }, [navigate]);

  const verifyToken = (token, storedUserName) => {
    fetch('/api/protected', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('la session a éxpiré');
      }
      return response.text();
    })
    .then(data => {
      console.log('Acces donné', data);
      setUserName(storedUserName);
    })
    .catch(err => {
      console.error(err.message);
      handleLogout();
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('userName');
    document.cookie = 'token=; Max-Age=0; path=/;';
    navigate('/login');
  };

  return (
    <div className="home-container">
      <div className="background-overlay"></div>
      <Layout />
      <BannerCarousel />
      <div className="welcome">
        <h1>Bonjour, {userName}!</h1>
        <p>Bienvenue sur <span className='what'>What's</span> <span className='in'>in the</span> <span className='fridge'>Fridge</span> ! </p>        
        <p>Que souhaitez-vous faire aujourd'hui?</p>        
        <div className="buttons-container">
          <button onClick={() => navigate('/explore')}>Explorer les recettes</button>
          <button onClick={() => navigate('/profile')}>Ajouter des ingrédients</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
