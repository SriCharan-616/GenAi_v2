import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import ArtisanRegister from './pages/ArtisanRegister';
import ArtisanProfile from './pages/ArtisanProfile';
import Login from './pages/Login';

const AppRoutes = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Homepage />} />

        {/* Register route – only if NOT logged in */}
        <Route
          path="/register"
          element={!isLoggedIn ? <ArtisanRegister /> : <Navigate to="/artisan-profile" replace />}
        />

        {/* Login route – only if NOT logged in */}
        <Route
          path="/login"
          element={!isLoggedIn ? <Login /> : <Navigate to="/artisan-profile" replace />}
        />

        {/* Profile route – only if logged in */}
        <Route
          path="/artisan-profile"
          element={isLoggedIn ? <ArtisanProfile /> : <Navigate to="/login" replace />}
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
