import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchedPage.css";

const SearchedPage = () => {
  const [activeTab, setActiveTab] = useState("For you");
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "For you") {
      navigate("/foryou");
    }
  };

  // Sample product data
  const products = [
    {
      id: 1,
      name: "PRISM+ W240",
      description: "24 IPS 100Hz Productivity Monitor",
      price: "$115.00",
      originalPrice: "$249.00",
      image: "/assets/monitor1.jpg",
      rating: 4.5,
      reviews: 193,
      flashSale: true,
      flashSaleEnd: "09:57:07",
    },
    {
      id: 2,
      name: "PRISM+ X240",
      description: "24 180Hz Curved Gaming Monitor",
      price: "$215.76",
      originalPrice: "$369.00",
      image: "/assets/monitor2.jpg",
      rating: 4.5,
      reviews: 247,
      flashSale: true,
      flashSaleEnd: "09:57:07",
    },
    {
      id: 3,
      name: "PRISM+ X450 PRO",
      description: "45 Super Ultrawide 120Hz Monitor",
      price: "$1,142.00",
      originalPrice: "$1,499.00",
      image: "/assets/monitor3.jpg",
      rating: 4.5,
      reviews: 56,
      flashSale: false,
      flashSaleEnd: "",
    },
    {
      id: 4,
      name: "PRISM+ X340 PRO EVO",
      description: "34 180Hz Curved Ultrawide Monitor",
      price: "$582.18",
      originalPrice: "$1,299.00",
      image: "/assets/monitor4.jpg",
      rating: 4.5,
      reviews: 23,
      flashSale: true,
      flashSaleEnd: "09:57:07",
    },
  ];

  return (
    <div className="searched-page">
      <header className="search-header">
        <input
          type="text"
          placeholder="Search products"
          className="search-bar"
        />
      </header>
      <div className="category-tabs">
        <button
          className={`category-tab ${activeTab === "Top" ? "active" : ""}`}
          onClick={() => handleTabClick("Top")}
        >
          Top
        </button>
        <button
          className={`category-tab ${activeTab === "For you" ? "active" : ""}`}
          onClick={() => handleTabClick("For you")}
        >
          For you
        </button>
        <button
          className={`category-tab ${activeTab === "Shop" ? "active" : ""}`}
          onClick={() => handleTabClick("Shop")}
        >
          Shop
        </button>

        <button
          className={`category-tab ${activeTab === "Videos" ? "active" : ""}`}
          onClick={() => handleTabClick("Videos")}
        >
          Videos
        </button>
        <button
          className={`category-tab ${activeTab === "Users" ? "active" : ""}`}
          onClick={() => handleTabClick("Users")}
        >
          Users
        </button>
        <button
          className={`category-tab ${activeTab === "Sounds" ? "active" : ""}`}
          onClick={() => handleTabClick("Sounds")}
        >
          Sounds
        </button>
        <button
          className={`category-tab ${activeTab === "LIVE" ? "active" : ""}`}
          onClick={() => handleTabClick("LIVE")}
        >
          LIVE
        </button>
      </div>
      <div className="sort-tabs">
        <button className="sort-tab active">Best match</button>
        <button className="sort-tab">Bestsellers</button>
        <button className="sort-tab">Price</button>
      </div>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">
                <span className="current-price">{product.price}</span>
                {product.originalPrice && (
                  <span className="original-price">
                    {product.originalPrice}
                  </span>
                )}
              </p>
              {product.flashSale && (
                <p className="flash-sale">
                  Flash Sale{" "}
                  <span className="flash-sale-end">{product.flashSaleEnd}</span>
                </p>
              )}
              <p className="product-rating">
                ⭐{product.rating}{" "}
                <span className="reviews">({product.reviews} reviews)</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchedPage;
