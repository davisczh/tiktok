import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SearchedPage.css";

const SearchedPage = () => {
  const [activeTab, setActiveTab] = useState("For you");
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (location.state && location.state.products) {
      setProducts(location.state.products);
      console.log("location reached, products:", location.state.products);
    } else {
      console.log("location.state or location.state.products not found");
    }
  }, [location.state]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "For you") {
      console.log('Searched Page', location.state.filters);
      navigate("/foryou", {state : {userId: location.state.userId , filters: location.state.filters }});
    }
  };

  if (!products || products.length === 0) {
    return (
      <div className="searched-page">
        <header className="search-header">
          <input
            type="text"
            placeholder="Search products"
            className="search-bar"
          />
        </header>
        <p>No products found. Please try searching again.</p>
      </div>
    );
  }



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
              src={product.imgUrl}
              alt={product.name}
              className="product-image"
            />
            <div className="product-info">
              <h3 className="product-name">{product.title}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">
                <span className="current-price">${product.price}</span>
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
                <span className="reviews">({product.stars}/5 stars)</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchedPage;
