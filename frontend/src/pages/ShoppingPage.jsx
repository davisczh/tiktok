import React from "react";
import { useSwipeable } from "react-swipeable";
import { useNavigate, useLocation } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import "./ShoppingPage.css";

const ShoppingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentProductIndex, preferences } = location.state || {};

  // Mock product data for demonstration
  const product = {
    id: 1,
    name: "PRISM+ W240",
    image: "/assets/monitor.jpg",
    description: "Flat IPS Productivity Monitor",
    specs: "24'' | FHD | IPS | 100Hz | 100% SRGB",
    price: 119.6,
    originalPrice: 249.0,
    discount: 52,
    rating: 4.5,
    reviews: 8,
    sold: 193,
  };

  const handleSwipeRight = () => {
    navigate("/foryou", {
      state: { currentProductIndex, preferences },
    });
  };

  const swipeHandlers = useSwipeable({
    onSwipedRight: handleSwipeRight,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const handleBackClick = () => {
    navigate("/foryou", {
      state: { currentProductIndex, preferences },
    });
  };

  return (
    <div {...swipeHandlers} className="shopping-page">
      <header className="shopping-header">
        <button className="back-button" onClick={handleBackClick}>
          ←
        </button>
        <div className="header-icons">
          <span>♡</span>
          <span>🛒</span>
          <span>⋮</span>
        </div>
      </header>
      <div className="content">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-details">
          <h1>{product.name}</h1>
          <h2>{product.description}</h2>
          <p>{product.specs}</p>
          <div className="flash-sale">
            <span>Flash Sale</span>
            <span>Ends in 07:43:58</span>
          </div>
          <div className="pricing">
            <span className="current-price">${product.price}</span>
            <span className="original-price">${product.originalPrice}</span>
            <span className="discount">-{product.discount}%</span>
          </div>
          <div className="rating">
            <span>
              ⭐ {product.rating} ({product.reviews})
            </span>
            <span>{product.sold} sold</span>
          </div>
          <div className="badges">
            <span>Secure payments</span>
            <span>100% Authentic</span>
          </div>
          <div className="select-options">
            <label htmlFor="color">Select options</label>
            <select id="color" name="color">
              <option value="black">Black</option>
              <option value="white">White</option>
            </select>
          </div>
          <div className="action-buttons">
            <button className="add-to-cart">Add to cart</button>
            <button className="buy-now">Buy now</button>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default ShoppingPage;
