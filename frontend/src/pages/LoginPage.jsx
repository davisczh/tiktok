import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css"; // Import the CSS file

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const generateUserId = () => {
    return `user-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      const userId = generateUserId();
      navigate("/main", { state: { userId } });
    } else {
      alert("Please enter a username");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Log in to TikTok</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
        />
        <button type="submit" className="login-button">
          Log in
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
