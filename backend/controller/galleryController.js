const { getUserPreferences, getImagesForRegions } = require('../models/galleryModel');

async function getGallery(req, res) {
  try {
    const userId = req.params.userId;
    const preferences = await getUserPreferences(userId);

    // Extract regions from user preferences (in lowercase)
    const regions = preferences.map(pref => pref.region);
    const images = await getImagesForRegions(regions);

    res.json({ images });
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    res.status(500).json({ error: 'Error fetching gallery images' });
  }
}

module.exports = { getGallery };
