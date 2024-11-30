import React from 'react';
import '../styles/home.css';

const Home = () => {
  return (
    <div className="home">
      <header className="home-header">
        <h1>Welcome to Real Estate Insights</h1>
        <p>Your gateway to the best properties and insights</p>
      </header>
      
      <section className="home-content">
        <div className="property-feature">
          <h2>Featured Properties</h2>
          <div className="property-list">
            <div className="property-item">
              <img src="https://via.placeholder.com/400x300" alt="Property 1" />
              <h3>Modern Villa in City Center</h3>
              <p>3 Beds | 2 Baths | 1,500 sqft</p>
              <button>View Details</button>
            </div>
            <div className="property-item">
              <img src="https://via.placeholder.com/400x300" alt="Property 2" />
              <h3>Luxury Apartment Near Beach</h3>
              <p>2 Beds | 2 Baths | 1,200 sqft</p>
              <button>View Details</button>
            </div>
            <div className="property-item">
              <img src="https://via.placeholder.com/400x300" alt="Property 3" />
              <h3>Cozy Cottage in Countryside</h3>
              <p>2 Beds | 1 Bath | 900 sqft</p>
              <button>View Details</button>
            </div>
          </div>
        </div>
        
        <div className="insights">
          <h2>Latest Insights</h2>
          <div className="insight-card">
            <h3>Market Trends</h3>
            <p>Find out how the real estate market is changing in your area.</p>
            <button>Read More</button>
          </div>
          <div className="insight-card">
            <h3>Investment Opportunities</h3>
            <p>Explore the best investment opportunities in real estate right now.</p>
            <button>Read More</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
