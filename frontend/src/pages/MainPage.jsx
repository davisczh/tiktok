import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./MainPage.css";
import BottomNav from "../components/BottomNav";

import FilterPanel from "./FilterPanel";

const MainPage = () => {
  const { state } = useLocation();
  const userId = state?.userId || "defaultUserId"; // Default to "defaultUserId" if no userId is provided
  const [searchInput, setSearchInput] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  // Sample product data
  const products = [
    {
      id: 1,
      name: "Soc bag",
      price: "$70.00",
      image: "/assets/cosbag.jpg",
      rating: 5.0,
    },
    {
      id: 2,
      name: "Hony Headphones",
      price: "$1.29",
      image: "/assets/headphones.jpg",
      rating: 4.6,
    },
    {
      id: 3,
      name: "Zosprey Hiking Bag",
      price: "$3.06",
      image: "/assets/hikingbag.jpg",
      rating: 4.5,
    },
    {
      id: 4,
      name: "Active Wear Tights",
      price: "$55.00",
      image: "/assets/lululemon.jpg",
      rating: 4.8,
    },
  ];

  // Event handler for the search button
  const handleSearch = () => {
    if (searchInput.trim()) {
      const filters = { title: searchInput };

      // Construct query parameters from filters
      const queryParams = new URLSearchParams({
        category: filters.category || "",
        min_price: filters.min_price || "",
        max_price: filters.max_price || "",
        title: filters.title || "",
      }).toString();

      // Construct the full URL using the userId
      const url = `/users/${userId}/get_products?${queryParams}`;

      // Log the constructed URL to the console
      console.log("Constructed URL:", url);

      navigate("/searched", { state: { query: searchInput } });
    }
  };

  const toggleFilterPanel = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleApplyFilters = (filters) => {
    // Update the title filter with the search input
    filters.title = searchInput;

    // Log the filters that would be sent to the backend
    console.log("Filters:", filters);

    // Assume setFilteredProducts will use filters to fetch and update product data
    // setFilteredProducts(updatedProducts);
  };

  return (
    <div className="main-container">
      <header className="main-header">
        <input
          type="text"
          placeholder="Search products"
          className="search-bar"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
        <button className="filter-button" onClick={toggleFilterPanel}>
          Filter
        </button>
      </header>
      <div className="category-tabs">
        <button className="category-tab active">All</button>
        <button className="category-tab">Super Saver</button>
        <button className="category-tab">Xtra Voucher</button>
        <button className="category-tab">Mall</button>
      </div>
      <div className="products-grid">
        {(filteredProducts.length > 0 ? filteredProducts : products).map(
          (product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">{product.price}</p>
                <p className="product-rating">⭐{product.rating}</p>
              </div>
            </div>
          )
        )}
      </div>
      <BottomNav />
      {isFilterOpen && (
        <FilterPanel onClose={toggleFilterPanel} onApply={handleApplyFilters} />
      )}
    </div>
  );
};

export default MainPage;
