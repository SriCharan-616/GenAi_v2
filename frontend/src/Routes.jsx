import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import ArtisanRegister from './pages/ArtisanRegister';
import ArtisanProfile from './pages/ArtisanProfile';
import Login from './pages/Login';

const AppRoutes = () => {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/register"
          element={<ArtisanRegister />}
        />
        <Route
          path="/artisan-profile"
          element={<ArtisanProfile />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;