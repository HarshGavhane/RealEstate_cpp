import React, { useEffect, useState } from "react";
import "./alerts.css";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch alerts
  const fetchAlerts = async () => {
    try {
      setLoading(true); // Start loading
      setError(null); // Reset error state before fetching
      // Simulated backend data fetch
      const data = [
        { id: 1, message: "Price drop in Downtown", timestamp: "2024-11-13" },
        { id: 2, message: "New listing in Midtown", timestamp: "2024-11-13" },
      ];
      setAlerts(data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      setError("Failed to load alerts. Please try again later.");
    } finally {
      setLoading(false); // End loading
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="alerts-wrapper">
      <section className="alerts" aria-labelledby="alerts-title">
        <h2 id="alerts-title" className="alerts__title">Your Alerts</h2>

        {/* Error Message */}
        {error && (
          <p className="alerts__message" role="alert" aria-live="assertive">
            {error}
          </p>
        )}

        {/* Loading Message */}
        {loading && !error ? (
          <p className="alerts__message" role="status" aria-live="polite">
            Loading alerts...
          </p>
        ) : alerts.length === 0 ? (
          <p className="alerts__message" role="alert">
            No alerts to display. Check back later!
          </p>
        ) : (
          <ul className="alerts__list">
            {alerts.map((alert) => (
              <li key={alert.id} className="alerts__item">
                <p>{alert.message}</p>
                <span className="alerts__timestamp">
                  {new Date(alert.timestamp).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Refresh Button */}
        <button
          onClick={fetchAlerts}
          className="alerts__refresh-button"
          aria-label="Refresh alerts"
        >
          Refresh Alerts
        </button>
      </section>
    </div>
  );
};

export default Alerts;
