const BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const login = async (username, password) => {
  const response = await fetch(`${BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password })
  });

  if (!response.ok) {
    throw new Error('Login failed. Please check your credentials.');
  }

  const data = await response.json();
  
  // Save token to localStorage if it exists in the response
  if (data.token) {
    localStorage.setItem('token', data.token);
  } else {
    throw new Error('No token received from server.');
  }

  return data;
};
