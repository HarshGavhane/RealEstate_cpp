import React from "react";

const Dropdown = ({ options, value, onChange }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)}>
    <option value="">Select Region</option>
    {options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
);

export default Dropdown;
