import React from 'react';
import { Link } from 'react-router-dom';

function RecipeCard({ recipe }) {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
      {recipe.image_url && (
        <img 
          src={recipe.image_url} 
          alt={recipe.title} 
          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
        />
      )}
      <div style={{ padding: '15px' }}>
        <h3 style={{ marginTop: 0 }}>
          <Link to={`/recipes/${recipe.id}`} style={{ textDecoration: 'none', color: '#333' }}>
            {recipe.title}
          </Link>
          {recipe.is_favorite && <span style={{ color: 'gold', marginLeft: '8px' }}>★ Favorite</span>}
        </h3>
        <p style={{ margin: '5px 0' }}>
          <strong>Time:</strong> {recipe.cooking_time} mins | <strong>Difficulty:</strong> {recipe.difficulty}
        </p>
        <p style={{ margin: '5px 0' }}>
          <strong>Servings:</strong> {recipe.servings}
        </p>
        <p style={{ fontSize: '0.9em', color: '#666', margin: '10px 0' }}>
          <strong>Categories:</strong> {recipe.categories?.map(c => c.name).join(', ') || 'None'}
        </p>
        <Link to={`/recipes/${recipe.id}`}>
          <button style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', width: '100%' }}>
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}

export default RecipeCard;
