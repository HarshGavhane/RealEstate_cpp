import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Importing Axios
import '../styles/imageGallery.css';

const Gallery = ({ userId }) => {
  const [imagesByRegion, setImagesByRegion] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [modalImage, setModalImage] = useState(''); // State to store the clicked image URL

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/gallery/${userId}`);
        const images = response.data.images;

        // Categorize images by region
        const imagesMap = images.reduce((acc, image) => {
          const region = image.split('/')[3]; // Assuming the region is part of the image URL
          if (!acc[region]) {
            acc[region] = [];
          }
          acc[region].push(image);
          return acc;
        }, {});

        setImagesByRegion(imagesMap);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching gallery images:", error);
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, [userId]);

  const openModal = (image) => {
    setModalImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage('');
  };

  return (
    <div className="gallery-container">
      {loading ? (
        <p>Loading images...</p>
      ) : Object.keys(imagesByRegion).length > 0 ? (
        Object.keys(imagesByRegion).map((region) => (
          imagesByRegion[region].length > 0 && (
            <div key={region} className="region-block">
              <h2 className="region-heading">{region.charAt(0).toUpperCase() + region.slice(1)}</h2>
              <div className="images-scroll-container">
                {imagesByRegion[region].map((image, index) => (
                  <div key={index} className="image-item" onClick={() => openModal(image)}>
                    <img src={image} alt={`Gallery Image ${index + 1}`} className="image-thumbnail" />
                  </div>
                ))}
              </div>
            </div>
          )
        ))
      ) : (
        <p className="no-images-message">No images available for your selected regions.</p>
      )}

      {/* Modal for viewing the clicked image */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <img src={modalImage} alt="Modal Image" className="modal-image" />
            <button className="modal-close-button" onClick={closeModal}>X</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
