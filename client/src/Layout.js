import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar.js";
import Sidebar from './Sidebar.js';
import './App.css'; 

const Layout = ({ children }) => {
  const [user, setUser] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    const token = tokenCookie ? tokenCookie.split('=')[1] : null;
    
    if (!token) {
      navigate('/login');
    } else {
      verifyToken(token);
    }
  }, [navigate]);

  const verifyToken = (token) => {
    fetch('/api/protected', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      return response.text();
    })
    .then(() => {
      fetchUserProfile(token);
    })
    .catch(()  => {
      handleLogout();
    });
  };

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userName');
    document.cookie = 'token=; Max-Age=0; path=/;';
    navigate('/login');
  };

  const handleUserClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const userProfilePic = user.ProfilePic;

  return (
    <div className="layout-container">
      <Navbar onUserClick={handleUserClick} userProfilePic={userProfilePic} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default Layout;
