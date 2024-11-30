import React, { useState } from 'react';
import '../styles/marketDataUpload.css'; // Import the CSS for styling the market trends form

const MarketTrendsForm = () => {
  // Initial form data
  const initialState = {
    regionID: '',
    averagePrice: '',
    demand: 'low',
  };

  const [formData, setFormData] = useState(initialState); // State for form data

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/markettrends/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Market trend added successfully');
        console.log('Response:', result);

        // Reset the form fields after successful submission
        setFormData(initialState);
      } else {
        throw new Error('Failed to add market trend');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding market trend');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label>Region ID</label>
        <select
          name="regionID"
          value={formData.regionID}
          onChange={handleChange}
          required
        >
          <option value="">Select Region</option>
          <option value="east">East</option>
          <option value="west">West</option>
          <option value="north">North</option>
          <option value="south">South</option>
        </select>

        <label>Average Price</label>
        <input
          type="number"
          name="averagePrice"
          value={formData.averagePrice}
          onChange={handleChange}
          required
        />

        <label>Demand</label>
        <select name="demand" value={formData.demand} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default MarketTrendsForm;
