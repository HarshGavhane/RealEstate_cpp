import React, { useState, useEffect } from "react";
import axios from "axios";
import '../../styles/preferences.css'; // Importing the CSS for styling

const PreferencesPage = ({ userId }) => {
  const [region, setRegion] = useState(""); // Region selected by the user
  const [propertyTypes, setPropertyTypes] = useState([]); // Preferred property types
  const [budget, setBudget] = useState([1000, 5000]); // Budget range
  const [preferences, setPreferences] = useState(null); // Current preferences for the selected region
  const [message, setMessage] = useState(""); // Message for feedback (e.g., success or no preferences)
  const [isEditing, setIsEditing] = useState(false); // Flag to toggle edit mode

  // Fetch preferences for the selected region
  const fetchPreferences = async (selectedRegion) => {
    setMessage("");
    setPreferences(null);
    setRegion(selectedRegion);

    if (!selectedRegion) return;

    try {
      const response = await axios.get(`http://localhost:3001/api/preferences/fetch`, {
        params: { userId, region: selectedRegion },
      });
      if (response.data.length > 0) {
        setPreferences(response.data[0]); // Assuming only one preference per region
        setPropertyTypes(response.data[0].propertyTypes || []);
        setBudget(response.data[0].budget || [1000, 5000]);
        setIsEditing(false); // Do not allow editing when preferences are found
      } else {
        setMessage("No preferences set for this region.");
        setPreferences(null); // No preferences found for the region
        setPropertyTypes([]); // Reset the property types
        setBudget([1000, 5000]); // Reset the budget
        setIsEditing(true); // Enable editing when no preferences are found
      }
    } catch (error) {
      setMessage("Failed to fetch preferences. Please try again.");
    }
  };

  // Fetch preferences when the component mounts or region changes
  useEffect(() => {
    if (region) {
      fetchPreferences(region);
    }
  }, [region, userId]);

  // Save or update preferences
  const handleSave = async () => {
    try {
      const data = { userId, region, propertyTypes, budget };
      await axios.post(`http://localhost:3001/api/preferences/create`, data);
      setMessage("Preferences saved successfully!");
      setPreferences(data);
      setIsEditing(false); // Switch to view mode
    } catch (error) {
      setMessage("Failed to save preferences. Please try again.");
    }
  };

  // Edit preferences
  const handleEdit = () => {
    setIsEditing(true); // Switch to edit mode
  };

  // Delete preferences
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/preferences/delete`, {
        params: { userId, region },
      });
      setMessage("Preferences deleted successfully!");
      setPreferences(null);
      setPropertyTypes([]);
      setBudget([1000, 5000]);
    } catch (error) {
      setMessage("Failed to delete preferences. Please try again.");
    }
  };

  return (
    <div className="preferences-container">
      <h1>Manage Preferences</h1>
      <div className="form-group">
        <label htmlFor="region-select">Select Region:</label>
        <select
          id="region-select"
          value={region}
          onChange={(e) => fetchPreferences(e.target.value)}
        >
          <option value="">Choose a region</option>
          <option value="East">East</option>
          <option value="West">West</option>
          <option value="North">North</option>
          <option value="South">South</option>
        </select>
      </div>

      {region && (
        <>
          {preferences ? (
            <p>Preferences loaded for <b>{region}</b>. You can {isEditing ? "edit" : "update"} them below:</p>
          ) : (
            <p>{message || "Set your preferences for this region below:"}</p>
          )}

          <div className="form-group">
            <label htmlFor="property-types">Property Types:</label>
            <select
              id="property-types"
              multiple
              value={propertyTypes}
              onChange={(e) =>
                setPropertyTypes([...e.target.selectedOptions].map((opt) => opt.value))
              }
              disabled={!isEditing}
            >
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="House">House</option>
            </select>
          </div>

          <div className="form-group">
            <label>Budget Range (€):</label>
            <input
              type="range"
              min="500"
              max="10000"
              value={budget[0]}
              onChange={(e) => setBudget([+e.target.value, budget[1]])}
              disabled={!isEditing}
            />
            <input
              type="range"
              min="500"
              max="10000"
              value={budget[1]}
              onChange={(e) => setBudget([budget[0], +e.target.value])}
              disabled={!isEditing}
            />
            <div>Selected Budget: €{budget[0]} - €{budget[1]}</div>
          </div>

          <div className="form-actions">
            {preferences ? (
              <>
                {isEditing ? (
                  <button className="save-btn" onClick={handleSave}>Save Preferences</button>
                ) : (
                  <>
                    <button className="edit-btn" onClick={handleEdit}>Edit Preferences</button>
                    <button className="delete-btn" onClick={handleDelete}>Delete Preferences</button>
                  </>
                )}
              </>
            ) : (
              <button className="save-btn" onClick={handleSave}>Save Preferences</button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PreferencesPage;
