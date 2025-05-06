import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import LoginPage from "./pages/auth/login/LoginPage";
import SignupPage from "./pages/auth/signup/SignupPage";
import HomePage from "./pages/HomePage";
import CategoryDetailPage from "./pages/CategoryDetailPage";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";
import "./App.css";
import BusinessInfoForm from "./components/seller/BusinessInfoForm";
import DashboardPage from "./pages/seller/DashboardPage";
import CreateProductPage from "./pages/seller/CreateProductPage";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <UserProvider>
          <CartProvider>
            <Router>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route
                  path="/category/:slug"
                  element={<CategoryDetailPage />}
                />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/business-info" element={<BusinessInfoForm />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route
                  path="/seller/create-product"
                  element={<CreateProductPage />}
                />
                {/* Add more routes as the application grows */}
              </Routes>
            </Router>
          </CartProvider>
        </UserProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
