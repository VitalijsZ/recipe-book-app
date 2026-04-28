import React, { useState, useEffect } from 'react';
import { getCategories } from '../api/recipesApi';

const UNIT_OPTIONS = [
  { value: "g", label: "grams" },
  { value: "ml", label: "milliliters" },
  { value: "pcs", label: "pieces" },
  { value: "tbsp", label: "tablespoon" },
  { value: "tsp", label: "teaspoon" },
  { value: "to_taste", label: "to taste" }
];

function RecipeForm({ initialData = {}, onSubmit, isSubmitting }) {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [cookingTime, setCookingTime] = useState(initialData.cooking_time || '');
  const [difficulty, setDifficulty] = useState(initialData.difficulty || 'easy');
  const [servings, setServings] = useState(initialData.servings || '');
  const [imageUrl, setImageUrl] = useState(initialData.image_url || '');
  
  // If initialData.categories has objects with .id, map them to array of ids
  const initialCategoryIds = initialData.categories 
    ? initialData.categories.map(c => c.id || c) 
    : [];
  const [selectedCategories, setSelectedCategories] = useState(initialCategoryIds);
  
  const [ingredients, setIngredients] = useState(initialData.ingredients || []);
  const [steps, setSteps] = useState(initialData.steps || []);

  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setAvailableCategories(data.results || data);
      } catch (error) {
        console.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: 'g' }]);
  };

  const handleUpdateIngredient = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleAddStep = () => {
    setSteps([...steps, { step_number: steps.length + 1, text: '' }]);
  };

  const handleUpdateStep = (index, value) => {
    const newSteps = [...steps];
    newSteps[index].text = value;
    setSteps(newSteps);
  };

  const handleRemoveStep = (index) => {
    // Also re-order the remaining steps' step_number
    setSteps(
      steps.filter((_, i) => i !== index).map((step, idx) => ({ ...step, step_number: idx + 1 }))
    );
  };

  const handleCategoryChange = (catId) => {
    if (selectedCategories.includes(catId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== catId));
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const recipeData = {
      title,
      description,
      cooking_time: parseInt(cookingTime, 10),
      difficulty,
      servings: parseInt(servings, 10),
      image_url: imageUrl,
      category_ids: selectedCategories,
      ingredients: ingredients.map(ing => ({
        name: ing.name,
        quantity: ing.quantity === '' || ing.quantity === null ? null : Number(ing.quantity),
        unit: ing.unit || 'g'
      })),
      steps: steps.map((step, index) => ({
        step_number: index + 1,
        text: step.text
      }))
    };

    onSubmit(recipeData);
  };

  const inputStyle = { width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <label>Title *</label>
        <input style={inputStyle} required type="text" value={title} onChange={e => setTitle(e.target.value)} />
      </div>

      <div>
        <label>Description</label>
        <textarea style={inputStyle} value={description} onChange={e => setDescription(e.target.value)} rows="3" />
      </div>

      <div style={{ display: 'flex', gap: '15px' }}>
        <div style={{ flex: 1 }}>
          <label>Cooking Time (mins) *</label>
          <input style={inputStyle} required type="number" min="1" value={cookingTime} onChange={e => setCookingTime(e.target.value)} />
        </div>
        <div style={{ flex: 1 }}>
          <label>Servings *</label>
          <input style={inputStyle} required type="number" min="1" value={servings} onChange={e => setServings(e.target.value)} />
        </div>
        <div style={{ flex: 1 }}>
          <label>Difficulty *</label>
          <select style={inputStyle} value={difficulty} onChange={e => setDifficulty(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div>
        <label>Image URL</label>
        <input style={inputStyle} type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
      </div>

      <div>
        <label>Categories</label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '5px' }}>
          {availableCategories.map(cat => (
            <label key={cat.id}>
              <input 
                type="checkbox" 
                checked={selectedCategories.includes(cat.id)}
                onChange={() => handleCategoryChange(cat.id)} 
              /> {cat.name}
            </label>
          ))}
        </div>
      </div>

      <hr style={{ width: '100%' }} />

      {/* Ingredients Section */}
      <div>
        <h3>Ingredients</h3>
        {ingredients.map((ing, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input 
              style={{ flex: 2, padding: '8px' }} 
              placeholder="Name" 
              required 
              value={ing.name} 
              onChange={e => handleUpdateIngredient(idx, 'name', e.target.value)} 
            />
            <input 
              style={{ flex: 1, padding: '8px' }} 
              placeholder="Quantity (e.g. 2)" 
              value={ing.quantity === null ? '' : ing.quantity} 
              onChange={e => handleUpdateIngredient(idx, 'quantity', e.target.value)} 
            />
            <select 
              style={{ flex: 1, padding: '8px' }} 
              value={ing.unit || 'g'} 
              onChange={e => handleUpdateIngredient(idx, 'unit', e.target.value)} 
            >
              {UNIT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button 
              type="button" 
              onClick={() => handleRemoveIngredient(idx)} 
              style={{ padding: '8px', color: 'red', cursor: 'pointer' }}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddIngredient} style={{ padding: '8px 15px', cursor: 'pointer' }}>
          + Add Ingredient
        </button>
      </div>

      <hr style={{ width: '100%' }} />

      {/* Steps Section */}
      <div>
        <h3>Steps</h3>
        {steps.map((step, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-start' }}>
            <span style={{ padding: '8px 0', minWidth: '20px' }}>{step.step_number}.</span>
            <textarea 
              style={{ flex: 1, padding: '8px' }} 
              placeholder="Instruction details" 
              required 
              rows="2"
              value={step.text} 
              onChange={e => handleUpdateStep(idx, e.target.value)} 
            />
            <button 
              type="button" 
              onClick={() => handleRemoveStep(idx)} 
              style={{ padding: '8px', color: 'red', cursor: 'pointer' }}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddStep} style={{ padding: '8px 15px', cursor: 'pointer' }}>
          + Add Step
        </button>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting} 
        style={{ 
          marginTop: '20px', 
          padding: '12px', 
          backgroundColor: '#28a745', 
          color: 'white', 
          fontSize: '16px', 
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          border: 'none',
          borderRadius: '4px'
        }}>
        {isSubmitting ? 'Saving...' : 'Save Recipe'}
      </button>
    </form>
  );
}

export default RecipeForm;
