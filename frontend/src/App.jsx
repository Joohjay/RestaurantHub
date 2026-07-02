import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./Components/navbar";
import Footer from "./Components/footer";
import Home from "./pages/home";
import Restaurants from "./pages/Restaurants";
import Login from "./pages/login";
import Register from "./pages/register";
import About from "./pages/about";
import Contact from "./pages/contact";
import RestaurantDetail from "./pages/restaurantdetail";
import Dashboard from "./pages/dashboard";
import Reservation from "./pages/reservation";
import Checkout from "./pages/checkout";
import Profile from "./pages/profile";
import Admin from "./pages/admin";
import ManageMenu from "./pages/managemenu";
import ManageOrders from "./pages/manageorders";
import { restaurantData } from "./data/restaurants";

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "dark";
    }
    return "dark";
  });

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const addToCart = (restaurant, item) => {
    setCartItems((currentItems) => {
      const existingIndex = currentItems.findIndex(
        (entry) => entry.restaurantId === restaurant.id && entry.name === item.name
      );
      if (existingIndex !== -1) {
        return currentItems.map((entry, index) =>
          index === existingIndex
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry
        );
      }
      return [
        ...currentItems,
        {
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (restaurantId, itemName) => {
    setCartItems((currentItems) =>
      currentItems.filter((entry) => !(entry.restaurantId === restaurantId && entry.name === itemName))
    );
  };

  const updateCartQuantity = (restaurantId, itemName, delta) => {
    setCartItems((currentItems) =>
      currentItems
        .map((entry) =>
          entry.restaurantId === restaurantId && entry.name === itemName
            ? { ...entry, quantity: Math.max(1, entry.quantity + delta) }
            : entry
        )
        .filter((entry) => entry.quantity > 0)
    );
  };

  const clearCart = () => setCartItems([]);
  const cartCount = cartItems.reduce((sum, entry) => sum + entry.quantity, 0);

  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} cartCount={cartCount} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<Restaurants restaurants={restaurantData} />} />
          <Route
            path="/restaurant/:id"
            element={<RestaurantDetail restaurants={restaurantData} addToCart={addToCart} />}
          />
          <Route path="/checkout" element={<Checkout cartItems={cartItems} removeFromCart={removeFromCart} updateCartQuantity={updateCartQuantity} clearCart={clearCart} />} />
          <Route path="/reservation" element={<Reservation restaurants={restaurantData} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/menu" element={<ManageMenu />} />
          <Route path="/orders" element={<ManageOrders />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
