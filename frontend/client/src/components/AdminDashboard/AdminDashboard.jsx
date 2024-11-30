import React, { useState } from 'react';
import UploadForm from '../../pages/ImageUpload'; // Import the UploadForm component
import MarketTrendsForm from '../../pages/MarketDataUpload'; // Import the MarketTrendsForm component
import './admindashboard.css'; // Import the common CSS for styling

const AdminDashboard = () => {
  const [showUploadForm, setShowUploadForm] = useState(true); // Toggle state for form view

  const handleButtonClick = (formType) => {
    setShowUploadForm(formType === 'upload'); // Toggle between forms
  };

  return (
    <div className="admin-dashboard">
      <h1>Welcome to the Admin Dashboard</h1>
      
      <div className="button-container">
        <button onClick={() => handleButtonClick('upload')}>Upload Image</button>
        <button onClick={() => handleButtonClick('market')}>Upload Market Trends</button>
      </div>

      {/* Conditionally render the forms based on button click */}
      <div className={`form-container ${showUploadForm ? 'show' : ''}`}>
        {showUploadForm ? <UploadForm /> : <MarketTrendsForm />}
      </div>
    </div>
  );
};

export default AdminDashboard;
