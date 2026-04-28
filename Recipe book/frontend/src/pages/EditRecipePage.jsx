import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import RecipeForm from '../components/RecipeForm';
import { getRecipeById, updateRecipe } from '../api/recipesApi';

function EditRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Authentication check
  if (!token) {
    return (
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h2>Authentication Required</h2>
        <p>You must be logged in to edit a recipe.</p>
        <Link to="/login" style={{ color: '#007bff' }}>Go to Login Page</Link>
      </div>
    );
  }

  // Fetch recipe data on mount
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const data = await getRecipeById(id);
        setRecipe(data);
      } catch (err) {
        setFetchError('Failed to load recipe details. It may not exist.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipe();
  }, [id]);

  const handleFormSubmit = async (recipeData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await updateRecipe(id, recipeData, token);
      navigate(`/recipes/${id}`);
    } catch (err) {
      setSubmitError('Failed to update recipe. Make sure your data is correct and you have permission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>Loading recipe data...</div>;
  }

  if (fetchError || !recipe) {
    return (
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', color: 'red' }}>
        <p>{fetchError || 'Recipe not found.'}</p>
        <Link to="/">&larr; Back to Home</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to={`/recipes/${id}`} style={{ textDecoration: 'none', color: '#007bff' }}>
          &larr; Back to Recipe Details
        </Link>
      </div>
      
      <h2>Edit Recipe: {recipe.title}</h2>
      
      {submitError && (
        <div style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>
          {submitError}
        </div>
      )}
      
      <RecipeForm initialData={recipe} onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}

export default EditRecipePage;
