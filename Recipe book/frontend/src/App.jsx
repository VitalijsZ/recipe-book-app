import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import AddRecipePage from './pages/AddRecipePage';
import EditRecipePage from './pages/EditRecipePage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        <Route 
          path="/add-recipe" 
          element={
            <ProtectedRoute>
              <AddRecipePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/recipes/:id/edit" 
          element={
            <ProtectedRoute>
              <EditRecipePage />
            </ProtectedRoute>
          } 
        />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
