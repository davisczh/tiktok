import React, { useState } from "react";
import "./FilterPanel.css";

const FilterPanel = ({ onClose, onApply }) => {
  const [selectedOptions, setSelectedOptions] = useState({
    category: null,
    trendiness: null,
    delivery: null,
  });

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleOptionClick = (group, option) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [group]: prevOptions[group] === option ? null : option,
    }));
  };

  const handleApply = () => {
    const filters = {
      category: selectedOptions.category,
      trendiness: selectedOptions.trendiness,
      delivery: selectedOptions.delivery,
      min_price: minPrice,
      max_price: maxPrice,
    };
    onApply(filters);
    onClose(); // Close the filter panel after applying filters
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <button className="filter-cancel" onClick={onClose}>
          Cancel
        </button>
        <h2>Filters</h2>
        <button className="filter-apply" onClick={handleApply}>
          Apply
        </button>
      </div>
      <div className="filter-options">
        <div className="filter-group">
          <h3>Category</h3>
          <button
            className={`filter-option ${
              selectedOptions.category === "Active Wear" ? "selected" : ""
            }`}
            onClick={() => handleOptionClick("category", "Active Wear")}
          >
            Active Wear
          </button>
          <button
            className={`filter-option ${
              selectedOptions.category === "Bags" ? "selected" : ""
            }`}
            onClick={() => handleOptionClick("category", "Bags")}
          >
            Bags
          </button>
          <button
            className={`filter-option ${
              selectedOptions.category === "Electronics" ? "selected" : ""
            }`}
            onClick={() => handleOptionClick("category", "Electronics")}
          >
            Electronics
          </button>
        </div>

        <div className="filter-group">
          <h3>Trendiness</h3>
          <button
            className={`filter-option ${
              selectedOptions.trendiness === "Low" ? "selected" : ""
            }`}
            onClick={() => handleOptionClick("trendiness", "Low")}
          >
            Low
          </button>
          <button
            className={`filter-option ${
              selectedOptions.trendiness === "Med" ? "selected" : ""
            }`}
            onClick={() => handleOptionClick("trendiness", "Med")}
          >
            Med
          </button>
          <button
            className={`filter-option ${
              selectedOptions.trendiness === "High" ? "selected" : ""
            }`}
            onClick={() => handleOptionClick("trendiness", "High")}
          >
            High
          </button>
        </div>
        <div className="filter-group">
          <h3>Delivery Timeline</h3>
          <button
            className={`filter-option ${
              selectedOptions.delivery === "1-2 days" ? "selected" : ""
            }`}
            onClick={() => handleOptionClick("delivery", "1-2 days")}
          >
            1-2 days
          </button>
          <button
            className={`filter-option ${
              selectedOptions.delivery === "5-7 days" ? "selected" : ""
            }`}
            onClick={() => handleOptionClick("delivery", "5-7 days")}
          >
            5-7 days
          </button>
        </div>
        <div className="filter-group">
          <h3>Budget</h3>
          <div className="budget-inputs">
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="budget-input"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="budget-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
