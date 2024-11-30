import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Correctly import jwt-decode
import './navbar.css';

const Navbar = () => {
  const location = useLocation(); // Get the current location (page URL)
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Array of routes where the navigation links should not be visible
  const noNavRoutes = ['/login', '/register', '/'];

  // Check if the user is logged in
  const token = localStorage.getItem('token');
  const decoded = token ? jwtDecode(token) : null;

  const isLoggedIn = decoded ? true : false; // Check if decoded token exists
  const isAdmin = decoded ? decoded.isAdmin : false; // Check if user is admin
  const userId = decoded ? decoded.userId : null; // Get the userId from the decoded token

  // Conditionally render the nav links and logout button based on the route and login status
  const shouldShowNavLinks = !noNavRoutes.includes(location.pathname) && isLoggedIn;

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/'); // Redirect to the home or login page after logout
  };

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to="/" className="navbar__logo-link">Real Estate Insights</Link>
      </div>
      <div className="navbar__links">
        {/* Conditionally render Dashboard, Profile, and Preferences links for logged-in users */}
        {shouldShowNavLinks && (
          <>
            <Link to="/dashboard" className="navbar__link">Dashboard</Link>
            <Link to="/profile" className="navbar__link">Profile</Link> {/* Profile link */}
            <Link to="/preferences-page" className="navbar__link">Preferences</Link>
            {/* Update the Gallery link to pass the userId */}
            {userId && <Link to={`/gallery/${userId}`} className="navbar__link">Gallery</Link>}
            
            {/* Only render the Admin Dashboard link if the user is an admin */}
            {isAdmin && (
              <Link to="/admin-dashboard" className="navbar__link">Admin</Link>
            )}

            {/* Conditionally render the Logout button */}
            {shouldShowNavLinks && (
              <button onClick={handleLogout} className="navbar__link navbar__logout">Logout</button>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
