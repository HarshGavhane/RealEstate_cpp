import React, { useState } from "react";
import "../SearchBar/searchbar.css";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    // Pass the search term to the parent component
    onSearch(searchTerm);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by region..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update state on input change
      />
      <button onClick={handleSearch}>Search</button> {/* Trigger search on click */}
    </div>
  );
};

export default SearchBar;
