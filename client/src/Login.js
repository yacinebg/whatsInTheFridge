import {React,useState} from 'react';
import './App.css'; 
import logo from "./assets/logo.png";
import fond from "./assets/fond2.webp";
import { useNavigate } from 'react-router-dom';


export default function Login (){
    const [data,setData] = useState({
      email :'',
      password : ''
    });

    const navigate = useNavigate();
    const [message,setMessage] = useState('');
    
    const handleOnChangeV =(e) =>{
      const {name,value} = e.target;
      setData(prevState=>({
        ...prevState,
        [name]: value
      }))
    };

    const handleChange = async (e) => {
      e.preventDefault();
      try {
          const response = await fetch("/api/login", {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
          });
          const jsonData = await response.json();
          if (response.ok) {
              document.cookie = `token=${jsonData.token}; path=/`;
              localStorage.setItem('userName', jsonData.userName);
              navigate('/home');
          } else {
              setMessage(jsonData.message || "Erreur de connexion");
          }
      } catch (error) {
          setMessage("L'utilisateur n'éxiste pas !");
      }
  };

    return (
        <div className="app">
          <div className="left">
            <div className='solo'>
            <img id="logo" onClick={()=>navigate("/")} src={logo} alt="What's in the Fridge Logo" className="logo" />
            </div>
            <div className="content">
            <form action="" method="get" className="formulaireLogin">
               
                <div className="form-example">
                    <label for="name">Email : </label>
                    <input type="text" name="email" id="name" onChange={handleOnChangeV} required />
                </div>
                <div className="form-example">
                    <label for="mdp">Mot de passe: </label>
                    <input type="password" name="password" id="mdp" onChange={handleOnChangeV} required />
                </div>
                <div className="connect">
              <input type="submit" value="Se connecter" onClick={handleChange} className="button" />
            </div>
            </form>
            </div>
              {message && <p style={{color:"red", textAlign:"center"}}>{message}</p>}
          </div>
          <div className='right'>
            <img src={fond} alt="Fridge Full of Food" className="background" />
          </div>
        </div>
      );
    }