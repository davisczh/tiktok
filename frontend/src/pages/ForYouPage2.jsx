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
  const [fetchingMore, setFetchingMore] = useState(false);
  const { preferences, addPreference } = useContext(PreferencesContext);
  const [loading, setLoading] = useState(true);
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
  const fetchProducts = async () => {
    console.log('state', location.state.filters);
    const currentFilters = location.state.filters;

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
      const url = `/users/${location.state.userId}/get_products?${queryParams}`;

      // Log the constructed URL to the console
      console.log("Constructed URL:", url);

    try {
      setLoading(true);
      const response = await api.get(url);
      console.log('API response', response);
      const fetchedProducts = response.data.products;
      console.log('Fetched products', fetchedProducts);
      setProducts(fetchedProducts);  // This replaces the old products with new ones
      setCurrentProductIndex(0);  // Reset the index to start from the first new product    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [location.state.userId]);

  // console.log('done');
  


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
  }, [location.state, currentProductIndex, preferences, addPreference, products]);

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
    const productKey = products[currentProductIndex]['asin'];
    updatePreferences(productKey, "NotInterested");

    if (currentProductIndex < products.length - 1) {
      setCurrentProductIndex(currentProductIndex + 1);
    } else {
      sendPreferencesToBackend();
    }
  };

  const handleSwipeLeft = () => {
    const productKey = products[currentProductIndex]['asin'];
    updatePreferences(productKey, "CheckListing");
    console.log('products[currentproductindex]',products[currentProductIndex]);
    navigate("/shopping", {
      state: products[currentProductIndex], currentProductIndex 
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
    const productKey = products[currentProductIndex]['asin'];
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
    setFetchingMore(true);
    try {
      const response = await api.post(`/users/${location.state.userId}/update_preferences`, preferences);
      console.log("Preferences successfully sent to backend:", response.data);
      
      // Fetch new products
      await fetchProducts();
      
      // No need to increment currentProductIndex here as it's reset in fetchProducts
    } catch (error) {
      console.error("Error sending preferences to backend:", error);
    } finally {
      setFetchingMore(false);
    }
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
      {loading ? (
        <div className="loading">Loading...</div>
      ) : products.length > 0 ? (
        <ForYouCard product={products[currentProductIndex]} />
      ) : (
        <div className="no-products">No products available</div>
      )}
      
      {fetchingMore && <div className="loading">Fetching more products...</div>}
      
      <BottomNav />
    </div>
  );
};

export default ForYouPage2;
