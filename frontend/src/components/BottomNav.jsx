import React from "react";
import "./BottomNav.css";

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <button className="nav-button">
        <img src="/assets/home-icon.jpg" alt="Home" />
        <span>Home</span>
      </button>
      <button className="nav-button active">
        <img src="/assets/shop-icon.png" alt="Shop" />
        <span>Shop</span>
      </button>
      <button className="nav-button add-button">
        <div className="add-icon">
          <img src="/assets/add-icon.jpg" alt="Add" />
        </div>
      </button>
      <button className="nav-button">
        <img src="/assets/inbox-icon.jpg" alt="Inbox" />
        <span>Inbox</span>
      </button>
      <button className="nav-button">
        <img src="/assets/profile-icon.jpg" alt="Profile" />
        <span>Profile</span>
      </button>
    </nav>
  );
};

export default BottomNav;
