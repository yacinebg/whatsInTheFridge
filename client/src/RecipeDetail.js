import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from './Layout';
import Comment from './Comment';
import "./RecipDetail.css";
import ReactLoading from 'react-loading';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
      const token = tokenCookie ? tokenCookie.split('=')[1] : null;

      try {
        const response = await fetch(`/api/recipe/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        setRecipe(data);
        setLoading(false);
      } catch (error) {
        setError('error: ' + error.message);
        setLoading(false);
      }
    };

    const storedUserName = localStorage.getItem('userName');
    setUserName(storedUserName || 'hamid');

    fetchRecipeDetails();
  }, [id]);
  
  if(loading){
    console.log("Loading");
    return (      
    <div className="loading-container">
      <ReactLoading type="spin" color="#00bfff" height={100} width={100} />
    </div>
  )
  }
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Layout />
      <div className="recipe-detail">
        <div className="recipe-detail-left">
          <div className="recipe-image-container">
            <img src={recipe.image} alt={recipe.title} className="recipe-detail-image" />
          </div>
          <h2>Ingredients</h2>
          <ul>
            {recipe.extendedIngredients && recipe.extendedIngredients.map((ingredient, index) => (
              <li key={index}>{ingredient.original}</li>
            ))}
          </ul>
        </div>
        <div className="recipe-detail-right">
          <h1>{recipe.title}</h1>
          <div className="recipe-detail-summary" dangerouslySetInnerHTML={{ __html: recipe.summary }}></div>
          <h2>Instructions</h2>
          <div dangerouslySetInnerHTML={{ __html: recipe.instructions }}></div>
          <div className="comments-section-recipe" ><Comment recipeId={id} userName={userName} isProfile={false} /></div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
