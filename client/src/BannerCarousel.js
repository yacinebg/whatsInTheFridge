import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './BannerCarousel.css';
import { Link } from 'react-router-dom';

const BannerCarousel = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('/api/carousel-recipes');
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error('Erreur carousel:', error);
      }
    };

    fetchRecipes();
  }, []);


  const groupedRecipes = [];
  for (let i = 0; i < recipes.length; i += 3) {
    groupedRecipes.push(recipes.slice(i, i + 3));
  }

  return (
    <Carousel
      showArrows={true}
      autoPlay={true}
      interval={3000}
      infiniteLoop={true}
      showThumbs={false}
      showStatus={false}
      stopOnHover={true}
      swipeable={true}
      dynamicHeight={false}
    >
      {groupedRecipes.length > 0 ? (
        groupedRecipes.map((group, index) => (
          <div key={index} className="slide">
            <div className="recipe-group-banner">
              {group.map((recipe, idx) => (
                <Link to={`/recipe/${recipe.recipeId}`} className="recipe-link-banner" key={idx}>
                  <div className="recipe-card-banner">
                    <img src={recipe.image} alt={recipe.title} />
                    <div className="recipe-info-banner">
                      <h3>{recipe.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="carousel-caption">Chargement ...</div>
      )}
    </Carousel>
  );
};

export default BannerCarousel;
