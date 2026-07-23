import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transaction from './pages/Transaction';
import ProtectedRoute from './components/protectedRoute';
function App() {
  return (
    <div>
      <Toaster
        position="top-center"
        expand={false}
        richColors
        closeButton
        offset="24px"
        toastOptions={{
          style: {
            maxWidth: '360px',
            width: '90vw',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={ 
          <ProtectedRoute>
          <Dashboard /> 
          </ProtectedRoute>
          } />
        <Route path="/transaction" element={ 
          <ProtectedRoute>
          <Transaction /> 
          </ProtectedRoute>
          } />
      </Routes>
    </div>
  );
}

export default App;
