import React, { createContext, useState } from "react";

export const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  const initialPreferences = {
    like_product: [],
    dislike_product: [],
    checked_product: [],
  };

  const [preferences, setPreferences] = useState(initialPreferences);

  const addPreference = (type, product) => {
    setPreferences((prev) => ({
      ...prev,
      [type]: [...prev[type], product],
    }));

  };


  return (
    <PreferencesContext.Provider value={{ preferences, addPreference }}>
      {children}
    </PreferencesContext.Provider>
  );
};
