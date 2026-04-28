import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import RecipeForm from '../components/RecipeForm';
import { createRecipe } from '../api/recipesApi';

function AddRecipePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simple token check
  if (!token) {
    return (
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h2>Authentication Required</h2>
        <p>You must be logged in to add a recipe.</p>
        <Link to="/login" style={{ color: '#007bff' }}>Go to Login Page</Link>
      </div>
    );
  }

  const handleFormSubmit = async (recipeData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await createRecipe(recipeData, token);
      navigate('/');
    } catch (err) {
      setError('Failed to create recipe. Make sure your data is correct and you are logged in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>&larr; Back to Home</Link>
      </div>
      
      <h2>Add New Recipe</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>
          {error}
        </div>
      )}
      
      <RecipeForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}

export default AddRecipePage;
