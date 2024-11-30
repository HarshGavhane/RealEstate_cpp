import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwtDecode
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Alerts from './components/Alerts/Alerts';
import UserPreferences from './components/UserPreferences/UserPreferences';
import Navbar from './components/Navbar/Navbar';
import UploadImageForm from './pages/ImageUpload';
import Gallery from './pages/ImageGallery';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import PreferencesPage from './pages/PreferencesPage/PreferencesPage'; // Import PreferencesPage
import ProfilePage from './pages/Profile';  // Import ProfilePage
import 'font-awesome/css/font-awesome.min.css';
import './App.css';

// PrivateRoute component to handle admin/user routing logic
const PrivateRoute = ({ element, role, ...props }) => {
  const token = localStorage.getItem('token');
  const decoded = token ? jwtDecode(token) : null;

  // If no token exists, redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If the user is not an admin and tries to access the admin dashboard, redirect to the user dashboard
  if (role === 'admin' && decoded?.isAdmin !== true) {
    return <Navigate to="/dashboard" />;
  }

  // Allow access to the element (page) if role and token validation pass
  return element;
};

const App = () => {
  const token = localStorage.getItem('token');
  const decoded = token ? jwtDecode(token) : null;

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload-image" element={<UploadImageForm />} />
        <Route path="/gallery/:userId" element={<Gallery userId={decoded?.userId} />} />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={<PrivateRoute element={<Dashboard />} />} 
        />
        <Route 
          path="/preferences" 
          element={<PrivateRoute element={<UserPreferences />} />} 
        />
        <Route 
          path="/alerts" 
          element={<PrivateRoute element={<Alerts />} />} 
        />
        
        {/* Preferences Page for CRUD */}
        <Route 
          path="/preferences-page" 
          element={
            <PrivateRoute 
              element={<PreferencesPage userId={decoded?.userId} />} // Passing userId from decoded token
            />
          } 
        />

        {/* Profile Page Route */}
        <Route 
          path="/profile" 
          element={
            <PrivateRoute 
              element={<ProfilePage userId={decoded?.userId} />} // Passing userId from decoded token
            />
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin-dashboard" 
          element={<PrivateRoute role="admin" element={<AdminDashboard />} />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
