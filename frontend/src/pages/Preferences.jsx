import React, { createContext, useState } from "react";

export const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  const initialPreferences = {
    like_product: [],
    dislike_product: [],
    checked_product: [],
  };

  const [preferences, setPreferences] = useState(initialPreferences);
  const [count, setCount] = useState(0);

  const addPreference = (type, product) => {
    setPreferences((prev) => ({
      ...prev,
      [type]: [...prev[type], product],
    }));
    setCount((prev) => prev + 1);

    if (count + 1 === 5) {
      sendPreferencesToBackend({
        ...preferences,
        [type]: [...preferences[type], product],
      });
      setPreferences(initialPreferences);
      setCount(0);
    }
  };

  const sendPreferencesToBackend = async (preferences) => {
    // Add your backend API call here
    console.log("Sending preferences to backend", preferences);
    // Example:
    // await fetch('/api/preferences', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(preferences),
    // });
  };

  return (
    <PreferencesContext.Provider value={{ preferences, addPreference }}>
      {children}
    </PreferencesContext.Provider>
  );
};
