import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/landingpage.css';
import image4 from '../images/image4.jpg';
import image5 from '../images/image5.jpg';
import image6 from '../images/image6.jpg';
import Footer from '../components/Footer/Footer';

const LandingPage = () => (
  <div className="landing-page">
    {/* Hero Section with Sliding Images */}
    <section className="hero-slider">
      <div className="slider">
        <div className="slides">
          <div className="slide">
            <img src={image4} alt="Modern Villa" />
          </div>
          <div className="slide">
            <img src={image5} alt="Luxury Apartment" />
          </div>
          <div className="slide">
            <img src={image6} alt="Cozy Cottage" />
          </div>
        </div>
      </div>
      <div className="hero__content">
        <h1 className="hero__title">Discover Your Dream Property</h1>
        <p className="hero__subtitle">
          Explore the best real estate options with premium insights and tools.
        </p>
        <Link to="/login" className="hero__cta">
          Explore Now
        </Link>
      </div>
    </section>

    {/* Features Section with Linear Grid */}
    <section className="features">
      <h2 className="section-title">Our Unique Features</h2>
      <div className="feature-grid">
        <div className="feature-card">
          <i className="feature-icon fas fa-chart-line"></i>
          <h3>Market Trends</h3>
          <p>Get up-to-date market data and analysis.</p>
        </div>
        <div className="feature-card">
          
          <h3>Custom Listings</h3>
          <p>Personalized property recommendations just for you.</p>
        </div>
        <div className="feature-card">
          <i className="feature-icon fas fa-shield-alt"></i>
          <h3>Secure Transactions</h3>
          <p>Reliable and transparent buying or renting experience.</p>
        </div>
        <div className="feature-card">
          <i className="feature-icon fas fa-map-marker-alt"></i>
          <h3>Location Insights</h3>
          <p>Find your ideal home in the perfect location.</p>
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default LandingPage;
