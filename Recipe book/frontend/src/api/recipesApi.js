const BASE_URL = 'https://recipe-book-app-glxz.onrender.com/api';

export const getRecipes = async ({ search, categoryIds, favorites } = {}) => {
  const params = new URLSearchParams();

  if (search) {
    params.append('search', search);
  }

  if (categoryIds && categoryIds.length > 0) {
    params.append('category_ids', categoryIds.join(','));
  }

  if (favorites !== undefined && favorites !== null) {
    params.append('favorites', String(favorites));
  }

  const queryString = params.toString() ? `?${params.toString()}` : '';
  
  const response = await fetch(`${BASE_URL}/recipes/${queryString}`);
  if (!response.ok) {
    throw new Error('Failed to fetch recipes');
  }
  return response.json();
};

export const getRecipeById = async (id) => {
  const response = await fetch(`${BASE_URL}/recipes/${id}/`);
  if (!response.ok) {
    throw new Error('Failed to fetch recipe');
  }
  return response.json();
};

export const getCategories = async () => {
  const response = await fetch(`${BASE_URL}/categories/`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};

export const createRecipe = async (recipeData, token) => {
  const response = await fetch(`${BASE_URL}/recipes/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(recipeData)
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error('Create recipe error:', errorData);
    throw new Error(JSON.stringify(errorData) || 'Failed to create recipe');
  }
  return response.json();
};

export const updateRecipe = async (id, recipeData, token) => {
  const response = await fetch(`${BASE_URL}/recipes/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(recipeData)
  });
  if (!response.ok) {
    throw new Error('Failed to update recipe');
  }
  return response.json();
};

export const deleteRecipe = async (id, token) => {
  const response = await fetch(`${BASE_URL}/recipes/${id}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to delete recipe');
  }

  return true;
};

export const updateFavorite = async (id, isFavorite, token) => {
  const response = await fetch(`${BASE_URL}/recipes/${id}/favorite/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify({
      is_favorite: isFavorite
    })
  });

  if (!response.ok) {
    throw new Error('Failed to update favorite status');
  }

  return response.json();
};
