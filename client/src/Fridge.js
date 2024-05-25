import React, { useState, useEffect } from 'react';
import './navbar.css';
import RecipeCard from './RecipeCard';

const Fridge = ({ token }) => {
  const [fridgeItems, setFridgeItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [error, setError] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchFridgeItems = async () => {
      try {
        const response = await fetch('/api/profile/fridge-items', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setFridgeItems(data || []);
      } catch (err) {
      }
    };

    fetchFridgeItems();
  }, [token]);

  const AddItem = async () => {
    if (!newItem) {
      setAlertMessage('Please enter an item');
      setShowAlert(true);
      return;
    }
    try {
      const response = await fetch('/api/profile/fridge-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: [newItem] }),
      });

      const data = await response.json();
      setFridgeItems([...fridgeItems, data]);
      setNewItem('');
    } catch (err) {

    }
  };

  const DeleteItem = async (itemId) => {
    try {
      const response = await fetch(`/api/profile/fridge-items/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFridgeItems(fridgeItems.filter(item => item.id !== itemId));
    } catch (err) {
    }
  };

  const handleGetRecipes = async () => {
    if (fridgeItems.length === 0) {
      setAlertMessage('Ton frigo est vide Chef !');
      setShowAlert(true);
      return;
    }
    try {
      const response = await fetch('/api/profile/fridge-recipes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setRecipes(data);
    } catch (err) {
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
    setAlertMessage('');
  };

  return (
    <div className="fridge-container">
      <h2>Mon Frigo</h2>
      <div className="fridge-items">
        {fridgeItems.map(item => (
          <div key={item.id} className="fridge-item">
            <span>{item.items.join(', ')}</span>
            <button onClick={() => DeleteItem(item.id)}>Supprimer</button>
          </div>
        ))}
      </div>
      <div className="fridge-add-item">
        <input className='assert'
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Ajouter ingredient (en anglais) "
        />
        <button onClick={AddItem}>Ajouter</button>
      </div>
      <button onClick={handleGetRecipes}>Chercher</button>
      <div className="recipes-list">
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
      {showAlert && (
        <div className="alert-modal">
          <div className="alert-content">
            <span className="close-alert" onClick={closeAlert}>&times;</span>
            <p>{alertMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fridge;
