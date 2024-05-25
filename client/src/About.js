import React from 'react';
import './App.css';
import Layout from './Layout';

const About = () => {
    return (
      <div className="about-container">
        <Layout />
        <h1>À propos de What's in the Fridge</h1>
        <div className="about-section">
          <h2>Comment utiliser</h2>
          <p>
            Bienvenue sur <strong>What's in the Fridge!</strong> Notre plateforme vous aide à trouver de délicieuses recettes en fonction des ingrédients que vous avez déjà à la maison. Voici comment vous pouvez utiliser notre site :
          </p>
          <ol>
            <li><strong>Inscrivez-vous / Connectez-vous :</strong> Créez un compte ou connectez-vous pour commencer à utiliser les fonctionnalités.</li>
            <li><strong>Ajoutez des ingrédients :</strong> Allez dans votre profil et ajoutez des ingrédients à votre frigo virtuel.</li>
            <li><strong>Trouvez des recettes :</strong> Utilisez la fonction Explorer pour trouver des recettes qui correspondent à vos ingrédients.</li>
            <li><strong>Partagez des commentaires :</strong> Partagez vos avis et modifications avec la communauté.</li>
          </ol>
        </div>
        <div className="about-section">
          <h2>Fonctionnalités</h2>
          <ul>
            <li><strong>Suggestions de recettes personnalisées :</strong> Obtenez des recettes basées sur ce que vous avez.</li>
            <li><strong>Gestion des ingrédients :</strong> Ajoutez et supprimez facilement des ingrédients de votre frigo virtuel.</li>
            <li><strong>Retour de la communauté :</strong> Lisez et laissez des commentaires sur les recettes.</li>
          </ul>
        </div>
        <div className="about-section">
          <h2>Informations supplémentaires</h2>
          <p>Ce projet a été réalisé dans le cadre de L'UE de PC3R, nous sommes 2 étudiants en Master STL à sorbonne université</p>
            <p>Kessal Yacine 21311739</p>
            <p>Zemali Mohamed Amine 21306050</p>
        </div>
      </div>
    );
  };
  
  export default About;
