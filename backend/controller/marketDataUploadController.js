const { createMarketTrend } = require('../models/marketDataModel');

const addMarketTrend = async (req, res) => {
  try {
    const { regionID, averagePrice, demand } = req.body;

    // Call the model to add data
    const result = await createMarketTrend(regionID, averagePrice, demand);

    res.status(201).json({
      message: 'Market trend added successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error adding market trend:', error);
    res.status(500).json({
      message: 'Failed to add market trend',
      error: error.message,
    });
  }
};

module.exports = { addMarketTrend };
