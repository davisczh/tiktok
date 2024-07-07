import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ForYouPage2 from "./pages/ForYouPage2";
import ShoppingPage from "./pages/ShoppingPage";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import SearchedPage from "./pages/SearchedPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/shopping" element={<ShoppingPage />} />
        <Route path="/searched" element={<SearchedPage />} />
        <Route path="/foryou" element={<ForYouPage2 />} />
      </Routes>
    </Router>
  );
}

export default App;
