import React, { useState, useEffect } from 'react';
import { getRecipes, getCategories } from '../api/recipesApi';
import RecipeCard from '../components/RecipeCard';

function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  // Fetch Categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        // Assuming paginated response with 'results' array, or plain array
        setCategories(data.results || data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Recipes when filters change
  useEffect(() => {
    const fetchFilteredRecipes = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRecipes({
          search,
          categoryIds: selectedCategories,
          favorites: showFavorites ? true : null
        });
        // Assuming paginated response with 'results' array, or plain array
        setRecipes(data.results || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Basic debounce for search input
    const timer = setTimeout(() => {
      fetchFilteredRecipes();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, selectedCategories, showFavorites]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <img
          src="/recipe-book-cover.jpg"
          alt="Recipe Book"
          style={{ width: '100%', maxWidth: '600px', height: 'auto', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
        />
      </div>

      {/* Filters Section */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Filters</h3>

        {/* Search */}
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '8px', width: '100%', maxWidth: '300px' }}
          />
        </div>

        {/* Favorites */}
        <div style={{ marginBottom: '10px' }}>
          <label>
            <input
              type="checkbox"
              checked={showFavorites}
              onChange={(e) => setShowFavorites(e.target.checked)}
            />
            {' '}Show Favorites Only
          </label>
        </div>

        {/* Categories */}
        <div>
          <strong>Categories: </strong>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '5px' }}>
            {categories.map(category => (
              <label key={category.id}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                />
                {' '}{category.name}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Recipes List */}
      <div>
        {loading && <p>Loading recipes...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        {!loading && !error && recipes.length === 0 && (
          <p>No recipes found matching your filters.</p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {!loading && !error && recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
