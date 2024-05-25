import React, { useState, useEffect } from 'react';
import './App.css'; 
import RecipeCard from './RecipeCard';
import Layout from './Layout';
import ReactLoading from 'react-loading';

const Explorer = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchRecipes = async (page) => {
    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    const token = tokenCookie ? tokenCookie.split('=')[1] : null;

    try {
      const response = await fetch(`/api/explore?page=${page}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      setRecipes(prevRecipes => [...prevRecipes, ...data.recipes]);
      setHasMore(data.recipes.length > 0);
      setLoading(false);
    } catch (error) {
      console.error('Erreur carousel:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes(page);
  }, [page]);

  const loadMoreRecipes = () => {
    setPage(prevPage => prevPage + 1);
  };

  if(loading){
    console.log("Loading");
    return (      
    <div className="loading-container">
      <ReactLoading type="spin" color="#00bfff" height={100} width={100} />
    </div>
  )
  }

  return (
    <div className="explorer">
      <Layout />
      <div className="recipe-grid">
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {recipes.map((recipe, index) => (
          <RecipeCard key={index} recipe={recipe} isProfile={false}/>
        ))}
      </div>
      {hasMore && !loading && (
        <button className="load-more-button" onClick={loadMoreRecipes}>
          Plus
        </button>
      )}
    </div>
  );
};

export default Explorer;
