import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/profile.css'; // Ensure to import the CSS file

const Profile = () => {
  const [preferences, setPreferences] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        // Get userId from localStorage (or replace with your preferred method)
        const userId = localStorage.getItem('userId'); // Retrieve from localStorage

        // Ensure userId is available
        if (!userId) {
          throw new Error('User not logged in');
        }

        const response = await axios.get(`http://localhost:3001/api/profile/${userId}`);
        
        // Log the full response to ensure you're getting the expected data
        console.log('Fetched preferences:', response.data);

        if (response.data.userChoices && Array.isArray(response.data.userChoices)) {
          setPreferences(response.data.userChoices);
        } else {
          throw new Error("Unexpected response structure");
        }

      } catch (err) {
        console.error("Error fetching preferences:", err.message);
        setError("Failed to fetch preferences.");
      }
    };

    fetchPreferences();
  }, []); // Empty dependency array ensures this runs once on component mount

  return (
    <div className="profile-container">
      <h1>User Preferences</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="preferences-table">
        {preferences.length === 0 ? (
          <p>No preferences found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Region</th>
                <th>Budget Range</th>
                <th>Property Types</th>
              </tr>
            </thead>
            <tbody>
              {preferences.map((choice, index) => (
                <tr key={index}>
                  <td>{choice.region}</td>
                  <td>
                    {choice.budgetRange.length > 0 ? (
                      `$${choice.budgetRange[0]} - $${choice.budgetRange[1]}`
                    ) : (
                      <p>No budget available</p>
                    )}
                  </td>
                  <td>
                    {choice.propertyTypes.length > 0 ? (
                      choice.propertyTypes.join(', ')
                    ) : (
                      <p>No property types available</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Profile;
