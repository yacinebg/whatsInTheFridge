import React, { useState } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import logo from "./assets/logo.png";
import fond from "./assets/fond2.webp";

export default function Sign() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        login: '',
        password: '',
        email: '',
        confirm_password: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    function validateEmail(email) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return regex.test(email);
    }

    async function handleSignUp(e) {
        e.preventDefault();

        const { login, password, email, confirm_password } = data;
        if (!login || !password || !email || !confirm_password) {
            setMessage("Tous les champs doivent être remplis.");
            return;
        }

        if (password !== confirm_password) {
            setMessage("Les mots de passe ne correspondent pas.");
            return;
        }

        if (!validateEmail(email)) {
            setMessage("Ce n'est pas une adresse Email valide.");
            return;
        }

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ login, email, password }),
            });

            if (response.ok) {
                setMessage('Inscription réussie. Vous pouvez vous connecter maintenant.');
                navigate('/login');
            } else {
                const resText = await response.text();
                setMessage(resText || 'Erreur lors de l\'inscription.');
            }
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            setMessage('Une erreur réseau ou serveur est survenue.');
        }
    }

    return (
        <div className="app">
            <div className="left">
                <div className='solo'>
                    <img id="logo" onClick={() => navigate("/")} src={logo} alt="What's in the Fridge Logo" className="logo" />
                </div>
                <div className="content">
                    <form action="" method="post" className="formulaireLogin">
                        <div className="form-example">
                            <label htmlFor="login">Pseudo :</label>
                            <input type="text" name="login" id="login" onChange={handleChange} required />
                        </div>
                        <div className="form-example">
                            <label htmlFor="password">Mot de passe :</label>
                            <input type="password" name="password" id="password" onChange={handleChange} required />
                        </div>
                        <div className="form-example">
                            <label htmlFor="email">Email :</label>
                            <input type="email" name="email" id="email" onChange={handleChange} required />
                        </div>
                        <div className="form-example">
                            <label htmlFor="confirm_password">Confirmez le mot de passe :</label>
                            <input type="password" name="confirm_password" onChange={handleChange} id="confirm_password" required />
                        </div>
                        <div className="form-example">
                            <button type="submit" onClick={handleSignUp} className="button" style={{marginLeft:"25%"}}>S'inscrire</button>
                        </div>
                    </form>
                    {message && <p style={{ color: "red", textAlign: "center" }}>{message}</p>}
                </div>
            </div>
            <div className='right'>
                <img src={fond} alt="Fridge Full of Food" className="background" />
            </div>
        </div>
    );
}
