import React, { useState, useEffect } from 'react';
import "./navbar.css";
import { FaUserCircle } from "react-icons/fa";
import ProfileImageUpload from './ProfileImageUpload.js';
import Layout from './Layout.js';
import Comment from './Comment'; 
import Fridge from './Fridge.js';
import fridgepic from "./assets/frigo2.png";
import ReactLoading from 'react-loading';

const Profile = () => {
  const [user, setUser] = useState({});
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tokenReceived, setToken] = useState("");


  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
        const token = tokenCookie ? tokenCookie.split('=')[1] : null;
        setToken(token);

        const response = await fetch('/api/user/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUser(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);


  if (error) return <div>Error: {error}</div>;
  if(loading){
    console.log("Loading");
    return (      
    <div className="loading-container">
      <ReactLoading type="spin" color="#00bfff" height={100} width={100} />
    </div>
  )
  }

  const ProfilePic = user.ProfilePic;

 
  const handleClickImageUpload = () => {
    setShowImageUpload(true);
  };

  const handleCloseImageUpload = () => {
    setShowImageUpload(false);
  };

  return (
    <div className="profile-container">
      <Layout />
      <div className="profile-content">
        <div className='banner'>
          {ProfilePic 
          ? <img src={ProfilePic} alt="Profile" className="profile-pic" onClick={handleClickImageUpload}/>
          : <FaUserCircle size={130} className="profile-pic" onClick={handleClickImageUpload}/>}
          <div className='username-profile'>{user.UserName}</div>
          {showImageUpload && (
            <div className="modal">
              <div className="modal-content">
                <span className="close-modal" onClick={handleCloseImageUpload}>+</span>
                <ProfileImageUpload token={tokenReceived} onClose={handleCloseImageUpload} />
              </div>
            </div>
          )}
        </div>
        <div className="fridge-section">
          <div className="fridge-image-container">
            <img src={fridgepic} alt="fridge" className='fridgepic'/>
          </div>
          <Fridge token={tokenReceived} isProfile={true}/>
        </div>
        <div className="comments-section-profile"> 
          <Comment userName={user.UserName} isProfile={true} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
