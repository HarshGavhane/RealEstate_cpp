import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "../SearchBar/SearchBar";
import SummaryCard from "../SummaryCard/SummaryCard";
import TrendsChart from "../TrendsChart/TrendsChart";
import "../Dashboard/dashboard.css";

const Dashboard = () => {
  const [marketData, setMarketData] = useState([]);
  const [summary, setSummary] = useState({ avgPrice: 0, totalProperties: 0, demandLevel: "Low" });
  const [region, setRegion] = useState(""); // Store region

  // Fetch market data based on region
  const fetchMarketData = async (region) => {
    try {
      const response = await axios.get("http://localhost:3001/market-trends", {
        params: { region }, // Pass the region parameter
      });
      setMarketData(response.data.trends);
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Error fetching market data:", error);
    }
  };

  const handleSearch = (searchTerm) => {
    setRegion(searchTerm); // Update region state when search term changes
  };

  // Fetch market data when region changes
  useEffect(() => {
    if (region) {
      fetchMarketData(region);
    }
  }, [region]);

  const avgPrice = summary.avgPrice !== null && summary.avgPrice !== undefined ? summary.avgPrice : 0;
  const avgPriceFormatted = avgPrice.toFixed(2);

  return (
    <div className="dashboard">
      <SearchBar onSearch={handleSearch} />
      <div className="dashboard-summary">
        <SummaryCard title="Average Price" value={`$${avgPriceFormatted}`} />
        <SummaryCard title="Total Properties" value={summary.totalProperties} />
        <SummaryCard title="Demand Level" value={summary.demandLevel} />
      </div>
      <TrendsChart data={marketData} />
    </div>
  );
};

export default Dashboard;
