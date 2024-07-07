import React, { useState, useEffect, useContext } from "react";
import { useSwipeable } from "react-swipeable";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import BottomNav from "../components/BottomNav";
import ForYouCard from "../components/ForYouCard";
import { PreferencesContext } from "./Preferences";

import "./ForYouPage2.css";

const ForYouPage2 = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [lastTap, setLastTap] = useState(0);
  const [activeTab, setActiveTab] = useState("For you");
  const { preferences, addPreference } = useContext(PreferencesContext);

  console.log(location);
  // const userId = location.state?.userId || "defaultUserId"; // Default to "defaultUserId" if no userId is provided
  // console.log(userId);
  // const url = `http://localhost:8000/users/${userId}/get_products`;
  // const response = axios.get(url);
  // console.log("Response:", response.data);
  // const products = response.data.products; // Adjust this based on your actual response structure
  // const handleSearch = async () => {
  //   const response = await api.get(`/users/${location.state.userId}/get_products`);
  //   console.log(response);
  //   const products = response.data.products;
  //   console.log('products', products);
  //   return products
  // }
  // const products = handleSearch()
  useEffect(() => {
    const handleSearch = async () => {
      try {
        const response = await api.get(`/users/${location.state.userId}/get_products`);
        console.log('API response', response);
        const products = response.data.products;
        console.log('Fetched products', products);
        setProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    
    handleSearch();
  }, [location.state.userId]);

  console.log('done');
  



  useEffect(() => {
    if (location.state && location.state.currentProductIndex !== undefined) {
      const index = location.state.currentProductIndex;
      console.log('index', index);
      if (index !== currentProductIndex) {
        setCurrentProductIndex(index);
        const productKey = products[index + 1]['asin'];
        console.log('productKey:', productKey);
        addPreference("checked_product", productKey);
      }
    }
    console.log("Current Preferences:", preferences);
  }, [location.state, currentProductIndex, preferences, addPreference]);

  const statusPriority = {
    CheckListing: 3,
    Like: 2,
    NotInterested: 1,
  };

  const getCurrentStatus = (productKey) => {
    if (preferences.checked_product.includes(productKey)) {
      return "CheckListing";
    } else if (preferences.like_product.includes(productKey)) {
      return "Like";
    } else if (preferences.dislike_product.includes(productKey)) {
      return "NotInterested";
    } else {
      return null;
    }
  };

  const updatePreferences = (productKey, newStatus) => {
    const currentStatus = getCurrentStatus(productKey);
    console.log(`Updating ${productKey} from ${currentStatus} to ${newStatus}`);

    if (
      !currentStatus ||
      statusPriority[newStatus] > statusPriority[currentStatus]
    ) {
      addPreference(
        newStatus === "Like"
          ? "like_product"
          : newStatus === "NotInterested"
          ? "dislike_product"
          : "checked_product",
        productKey
      );
    }
  };

  const handleSwipeUp = () => {
    const productKey = products[index]['asin'];
    updatePreferences(productKey, "NotInterested");

    if (currentProductIndex < products.length - 1) {
      setCurrentProductIndex(currentProductIndex + 1);
    } else {
      sendPreferencesToBackend();
    }
  };

  const handleSwipeLeft = () => {
    const productKey = products[index]['asin'];
    updatePreferences(productKey, "CheckListing");

    navigate("/shopping", {
      state: { currentProductIndex, preferences },
    });
  };

  const handleTap = (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    console.log("Tap detected. Tap length:", tapLength);

    if (tapLength < 300 && tapLength > 0) {
      console.log("Double tap detected.");
      handleDoubleClick();
    }

    setLastTap(currentTime);
  };
  const handleDoubleClick = () => {
    const productKey = products[index]['asin'];
    console.log("Double click action for:", productKey);
    if (currentProductIndex < products.length - 1) {
      updatePreferences(productKey, "Like");
      setCurrentProductIndex(currentProductIndex + 1);
    } else {
      sendPreferencesToBackend();
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedUp: handleSwipeUp,
    onSwipedLeft: handleSwipeLeft,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const sendPreferencesToBackend = async () => {
    console.log("Sending preferences to backend:", preferences);
    try {
      const response = await api.post(`/users/${location.state.userId}/update_preferences`, preferences);
      console.log("Preferences successfully sent to backend:", response.data);
      const response1 = await api.get()
    } catch (error) {
      console.error("Error sending preferences to backend:", error);
    }    // Placeholder for the actual API call to send data to the backend
    // fetch("/api/send-preferences", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(preferences),
    // });
  };
  console.log('currentindex', currentProductIndex);
  console.log('test products', products)
  const currentProduct = products[currentProductIndex];
  console.log('currentProduct', currentProduct);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "Shop") {
      navigate("/main");
    }
  };

  return (
    <div {...swipeHandlers} onClick={handleTap} className="for-you-page">
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
        <ForYouCard product={currentProduct} />
      <BottomNav />
    </div>
  );
};

export default ForYouPage2;
