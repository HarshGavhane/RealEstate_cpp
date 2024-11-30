import React from "react";
import Slider from "react-slider";

const RangeSlider = ({ value, onChange, min, max }) => (
  <div>
    <Slider
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
    />
    <div>Selected Budget: €{value}</div>
  </div>
);

export default RangeSlider;
