const dashboardModel = require('../models/dashboardModel');

// Controller function to handle market trends fetch
const getMarketTrends = async (req, res) => {
  const { region } = req.query; // Extract region from the query string

  if (!region) {
    return res.status(400).json({ message: "Region is required" });
  }

  try {
    const trends = await dashboardModel.getMarketTrends(region);
    if (!trends || trends.length === 0) {
      return res.status(404).json({ message: "No trends found for this region" });
    }

    const summary = {
      avgPrice: calculateAveragePrice(trends),
      totalProperties: trends.length,
      demandLevel: calculateDemandLevel(trends),
    };

    res.json({ trends, summary });
  } catch (error) {
    console.error('Error fetching market trends:', error);
    res.status(500).json({ message: "Failed to fetch data", error: error.message });
  }
};

// Helper functions for calculating averages and demand levels
const calculateAveragePrice = (trends) => {
  const total = trends.reduce((sum, trend) => sum + trend.AveragePrice, 0); // Make sure this field exists in the items
  return total / trends.length || 0;
};

const calculateDemandLevel = (trends) => {
  const demandLevels = { High: 0, Medium: 0, Low: 0 };

  // Count occurrences of each demand level
  trends.forEach((trend) => {
    const demand = trend.Demand ? trend.Demand.toUpperCase() : '';  // Normalize to uppercase for consistency
    if (demand === "HIGH") demandLevels.High += 1;
    else if (demand === "MEDIUM") demandLevels.Medium += 1;
    else if (demand === "LOW") demandLevels.Low += 1;
  });

  // Log to check counts for debugging
  console.log("Demand Levels:", demandLevels);

  // Determine overall demand level based on counts
  if (demandLevels.High > demandLevels.Medium && demandLevels.High > demandLevels.Low) {
    return "High";
  } else if (demandLevels.Medium > demandLevels.Low) {
    return "Medium";
  } else {
    return "Low";
  }
};

module.exports = { getMarketTrends };
