import React from "react";
import Select from "react-select";

const MultiSelect = ({ options, value, onChange }) => {
  const handleChange = (selectedOptions) => {
    const values = selectedOptions.map((opt) => opt.value);
    onChange(values);
  };

  return (
    <Select
      isMulti
      options={options.map((opt) => ({ value: opt, label: opt }))}
      value={value.map((val) => ({ value: val, label: val }))}
      onChange={handleChange}
    />
  );
};

export default MultiSelect;
