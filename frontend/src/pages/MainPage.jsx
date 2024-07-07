import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./MainPage.css";
import BottomNav from "../components/BottomNav";
import FilterPanel from "./FilterPanel";

const MainPage = () => {
  const { state } = useLocation();
  const userId = state?.userId || "defaultUserId"; // Default to "defaultUserId" if no userId is provided
  const [searchInput, setSearchInput] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({}); // State to store applied filters
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
  const handleSearch = async () => {
    if (searchInput.trim()) {
      const currentFilters = { ...filters, title: searchInput };

      // Construct query parameters from filters
      const queryParams = new URLSearchParams({
        category: currentFilters.category || "",
        min_price: currentFilters.min_price || "",
        max_price: currentFilters.max_price || "",
        title: currentFilters.title || "",
        trendiness: currentFilters.trendiness || "",
        delivery_time: currentFilters.delivery || "",
      }).toString();

      // Construct the full URL using the userId
      const url = `/users/${userId}/get_products?${queryParams}`;

      // Log the constructed URL to the console
      console.log("Constructed URL:", url);

      try {
        // Perform the GET request using Axios
        const response = await axios.get(url);
        const products = response.data.products; // Adjust this based on your actual response structure
        setFilteredProducts(products);

        // Navigate to the searched page with the results
        navigate("/searched", {
          state: { query: searchInput, filters: currentFilters, products },
        });
      } catch (error) {
        console.error("Error fetching products:", error);
        // Handle error appropriately here
      }
    }
  };

  const toggleFilterPanel = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleApplyFilters = (appliedFilters) => {
    setFilters(appliedFilters);
    console.log("Filters:", appliedFilters);
    // Optionally, you could trigger a search here if you want to fetch data immediately after applying filters
    // handleSearch();
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
