import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import ArtisanRegister from './pages/ArtisanRegister';


const AppRoutes = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/register"
          element={<ArtisanRegister />}
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;