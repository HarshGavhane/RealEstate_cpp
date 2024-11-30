import React, { useState } from 'react';
import axios from 'axios';
import '../styles/imageUpload.css' 

const UploadForm = () => {
  const [region, setRegion] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');

  const handleRegionChange = (e) => {
    setRegion(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!region || !image) {
      alert('Please select a region and upload an image.');
      return;
    }

    const formData = new FormData();
    formData.append('region', region);
    formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:3001/api/images/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(response.data.message);
      
      // Refresh the page after successful upload
      window.location.reload();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Check console for details.');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label>
          Select Region:
          <select value={region} onChange={handleRegionChange}>
            <option value="">Select</option>
            <option value="east">East</option>
            <option value="west">West</option>
            <option value="north">North</option>
            <option value="south">South</option>
          </select>
        </label>
        <br />
        <label>
          Upload Image:
          <input type="file" onChange={handleImageChange} />
        </label>
        <br />
        {preview && (
          <div className="image-preview-container">
            <h3>Image Preview:</h3>
            <img src={preview} alt="Preview" className="image-preview" />
          </div>
        )}
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadForm;
