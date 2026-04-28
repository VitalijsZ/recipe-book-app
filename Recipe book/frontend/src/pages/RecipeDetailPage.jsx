import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getRecipeById, deleteRecipe, updateFavorite } from '../api/recipesApi';

function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const data = await getRecipeById(id);
        setRecipe(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await deleteRecipe(id, token);
        navigate('/');
      } catch (err) {
        alert('Failed to delete recipe. Ensure you have permission.');
      }
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      const updatedRecipe = await updateFavorite(id, !recipe.is_favorite, token);
      setRecipe(updatedRecipe);
    } catch (err) {
      alert('Failed to update favorite status.');
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>Loading recipe...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', color: 'red' }}>
        <p>Error: {error}</p>
        <Link to="/">&larr; Back to Home</Link>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <p>Recipe not found.</p>
        <Link to="/">&larr; Back to Home</Link>
      </div>
    );
  }

  // Ensure steps are ordered by step_number
  const sortedSteps = recipe.steps ? [...recipe.steps].sort((a, b) => a.step_number - b.step_number) : [];

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>&larr; Back to Home</Link>
        
        {token && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleFavoriteToggle} 
              style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              {recipe.is_favorite ? '★ Unfavorite' : '☆ Favorite'}
            </button>
            <Link to={`/recipes/${id}/edit`}>
              <button style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px' }}>
                Edit
              </button>
            </Link>
            <button 
              onClick={handleDelete} 
              style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        {recipe.image_url && (
          <img 
            src={recipe.image_url} 
            alt={recipe.title} 
            style={{ width: '100%', maxHeight: '450px', objectFit: 'cover', display: 'block' }}
          />
        )}
        
        <div style={{ padding: '30px', textAlign: 'left' }}>
          <h1 style={{ marginTop: 0, marginBottom: '15px', fontSize: '2.2rem', color: '#222' }}>
            {recipe.title}
            {recipe.is_favorite && <span style={{ color: 'gold', marginLeft: '10px' }}>★</span>}
          </h1>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', color: '#666', flexWrap: 'wrap', paddingBottom: '15px', borderBottom: '1px solid #eee', fontSize: '0.95rem' }}>
            <span><strong>Time:</strong> {recipe.cooking_time} mins</span>
            <span><strong>Difficulty:</strong> {recipe.difficulty}</span>
            <span><strong>Servings:</strong> {recipe.servings}</span>
            <span><strong>Categories:</strong> {recipe.categories?.map(c => c.name).join(', ') || 'None'}</span>
          </div>

          {recipe.description && (
            <div style={{ marginBottom: '35px' }}>
              <h3 style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '8px', marginBottom: '15px', color: '#333' }}>Description</h3>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', margin: 0, color: '#444' }}>{recipe.description}</p>
            </div>
          )}

          <div style={{ marginBottom: '35px' }}>
            <h3 style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '8px', marginBottom: '15px', color: '#333' }}>Ingredients</h3>
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {recipe.ingredients.map(ing => {
                  let displayQuantity = ing.quantity;
                  if (displayQuantity !== null && displayQuantity !== undefined) {
                    const num = Number(displayQuantity);
                    if (Number.isInteger(num)) {
                      displayQuantity = num;
                    }
                  }

                  return (
                    <div key={ing.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #eee', paddingBottom: '6px' }}>
                      <span style={{ textAlign: 'left', fontWeight: '500', color: '#333' }}>{ing.name}</span>
                      <span style={{ textAlign: 'right', color: '#666' }}>
                        {ing.unit === 'to_taste' 
                          ? 'to taste'
                          : `${displayQuantity !== null ? displayQuantity : ''} ${ing.unit}`.trim()}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: '#666' }}>No ingredients listed.</p>
            )}
          </div>

          <div style={{ marginBottom: '10px' }}>
            <h3 style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '8px', marginBottom: '15px', color: '#333' }}>Instructions</h3>
            {sortedSteps.length > 0 ? (
              <ol style={{ lineHeight: '1.8', paddingLeft: '25px', textAlign: 'left', margin: 0, color: '#444' }}>
                {sortedSteps.map(step => (
                  <li key={step.id} style={{ marginBottom: '20px', paddingLeft: '5px' }}>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{step.text}</div>
                  </li>
                ))}
              </ol>
            ) : (
              <p style={{ color: '#666' }}>No instructions listed.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetailPage;