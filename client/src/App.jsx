import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/protectedRoute';
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={ 
          <ProtectedRoute>
          <Dashboard /> 
          </ProtectedRoute>
          } />
      </Routes>
    </div>
  );
}

export default App;
