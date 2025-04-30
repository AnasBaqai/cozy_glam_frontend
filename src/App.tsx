import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/login/LoginPage";
import SignupPage from "./pages/auth/signup/SignupPage";
import HomePage from "./pages/HomePage";
import CategoryDetailPage from "./pages/CategoryDetailPage";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/CartContext";
import "./App.css";

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/category/:slug" element={<CategoryDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          {/* Add more routes as the application grows */}
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
