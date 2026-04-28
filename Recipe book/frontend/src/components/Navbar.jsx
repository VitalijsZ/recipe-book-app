import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={{ padding: '15px 20px', backgroundColor: '#333', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
        Recipe Book
      </Link>
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
        {token ? (
          <>
            <Link to="/add-recipe" style={{ color: 'white', textDecoration: 'none' }}>Add Recipe</Link>
            <button 
              onClick={handleLogout} 
              style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid white', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', padding: '5px 10px' }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
