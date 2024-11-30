const { getUserChoices } = require("../models/profileModel");

const fetchUserChoices = async (req, res) => {
  try {
    const userId = req.params.userId;

    const userChoices = await getUserChoices(userId);

    res.status(200).json({
      message: "User preferences fetched successfully",
      userChoices,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { fetchUserChoices };
