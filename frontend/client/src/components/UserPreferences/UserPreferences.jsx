import React, { useState, useEffect } from "react";
import "./userpreferences.css";

const UserPreferences = () => {
  const [region, setRegion] = useState("");
  const [priceRange, setPriceRange] = useState([100000, 500000]);
  const [propertyType, setPropertyType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preferences, setPreferences] = useState(null);

  // Simulate fetching user preferences
  const fetchPreferences = async () => {
    try {
      setLoading(true); // Start loading
      setError(null); // Reset error state before fetching
      // Simulated backend data fetch
      const data = {
        region: "Downtown",
        priceRange: [200000, 600000],
        propertyType: "apartment",
      };
      setPreferences(data);
      setRegion(data.region);
      setPriceRange(data.priceRange);
      setPropertyType(data.propertyType);
    } catch (error) {
      console.error("Error fetching preferences:", error);
      setError("Failed to load preferences. Please try again later.");
    } finally {
      setLoading(false); // End loading
    }
  };

  // Fetch preferences on mount
  useEffect(() => {
    fetchPreferences();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for submitting preferences
    console.log("Preferences updated:", { region, priceRange, propertyType });
  };

  return (
    <div className="user-preferences-wrapper">
      <section className="user-preferences" aria-labelledby="preferences-title">
        <h2 id="preferences-title" className="user-preferences__title">Set Your Preferences</h2>

        {/* Error Message */}
        {error && (
          <p className="user-preferences__message" role="alert" aria-live="assertive">
            {error}
          </p>
        )}

        {/* Loading Message */}
        {loading && !error ? (
          <p className="user-preferences__message" role="status" aria-live="polite">
            Loading preferences...
          </p>
        ) : preferences ? (
          <form onSubmit={handleSubmit} className="user-preferences__form">
            {/* Region Input */}
            <div className="form-group">
              <label htmlFor="region">Preferred Region</label>
              <input
                type="text"
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Enter your preferred region"
              />
            </div>

            {/* Price Range Slider */}
            <div className="form-group">
              <label htmlFor="price-range">Price Range</label>
              <div className="price-range-sliders">
                <input
                  type="range"
                  id="price-range-min"
                  min="0"
                  max="1000000"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([parseInt(e.target.value), priceRange[1]])
                  }
                />
                <input
                  type="range"
                  id="price-range-max"
                  min="0"
                  max="1000000"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value)])
                  }
                />
              </div>
              <div className="price-range-labels">
                <span>€{priceRange[0]}</span> - <span>€{priceRange[1]}</span>
              </div>
            </div>

            {/* Property Type Dropdown */}
            <div className="form-group">
              <label htmlFor="property-type">Property Type</label>
              <select
                id="property-type"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="">Select Property Type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="condo">Condo</option>
              </select>
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-button">
              Save Preferences
            </button>
          </form>
        ) : (
          <p className="user-preferences__message" role="alert">
            No preferences found. Please set your preferences!
          </p>
        )}
      </section>
    </div>
  );
};

export default UserPreferences;
