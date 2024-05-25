import React from 'react';
import './navbar.css';
import image3 from "./assets/image5.jpg";
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe}) => {
  const tags = [
    recipe.vegetarian && 'Vegetarian',
    recipe.vegan && 'Vegan',
    recipe.glutenFree && 'Gluten Free',
    recipe.dairyFree && 'Dairy Free',
    recipe.veryHealthy && 'veryHealthy',
    recipe.veryPopular && 'veryPopular',
    recipe.sustainable && 'sustainable',
    recipe.lowFodmap && 'lowFodmap',
  ].filter(Boolean);

  const cuisines = recipe.cuisines || []; 

  return (
    <div className="recipe-card">
      <Link to={`/recipe/${recipe.id}`} className="recipe-link" >
        <img src={recipe.image || image3} alt={recipe.title} className="recipe-image" />
        <div className="recipe-details">
          <h3 className="recipe-title">{recipe.title}</h3>
          <div className="recipe-tags">
            {tags.map((tag, index) => (
              <span key={index} className="recipe-tag">{tag}</span>
            ))}
            {cuisines.map((cuisine, index) => (
              <span key={index} className="recipe-tag">{cuisine}</span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RecipeCard;
