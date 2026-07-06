import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import { ToastProvider } from "./context/ToastContext";
import Navbar from "./Components/navbar";
import Footer from "./Components/footer";
import ErrorBoundary from "./Components/ErrorBoundary";
import Home from "./pages/home";
import Restaurants from "./pages/Restaurants";
import Login from "./pages/login";
import Register from "./pages/register";
import ForgotPassword from "./pages/forgotpassword";
import ResetPassword from "./pages/resetpassword";
import About from "./pages/about";
import Contact from "./pages/contact";
import RestaurantDetail from "./pages/restaurantdetail";
import Dashboard from "./pages/dashboard";
import Reservation from "./pages/reservation";
import Checkout from "./pages/checkout";
import Profile from "./pages/profile";
import OwnerDashboard from "./pages/admin";
import AdminDashboard from "./pages/admindashboard";
import AdminUsers from "./pages/adminusers";
import AdminOwners from "./pages/adminowners";
import AdminCustomers from "./pages/admincustomers";
import AdminRestaurants from "./pages/adminrestaurants";
import AdminMenus from "./pages/adminmenus";
import AdminOrders from "./pages/adminorders";
import ManageMenu from "./pages/managemenu";
import ManageOrders from "./pages/manageorders";
import ManageRestaurants from "./pages/managerestaurants";
import ManageReservations from "./pages/managereservations";
import OrderReceipt from "./pages/orderreceipt";
import NotFound from "./pages/notfound";

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "dark";
    }
    return "dark";
  });

  const [cartItems, setCartItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("user") || "null");
    }
    return null;
  });
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    async function verifySession() {
      const token = localStorage.getItem("token");
      if (!token) {
        setAuthChecking(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setCurrentUser(null);
          return;
        }

        const user = await response.json();
        localStorage.setItem("user", JSON.stringify(user));
        setCurrentUser(user);
      } catch (error) {
        console.error(error);
      } finally {
        setAuthChecking(false);
      }
    }

    verifySession();
  }, []);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const requireAuth = (element) => {
    return currentUser ? element : <Navigate to="/login" replace />;
  };

  const requireRole = (element, allowedRoles) => {
    if (!currentUser) return <Navigate to="/login" replace />;
    if (allowedRoles.includes(currentUser.role)) return element;
    return <Navigate to={currentUser.role === "admin" ? "/admin" : "/dashboard"} replace />;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    window.location.href = "/";
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
          menuItemId: item.id || item.menu_item_id,
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

  if (authChecking) {
    return <div className="page"><p>Loading session...</p></div>;
  }

  return (
    <ToastProvider>
      <Navbar theme={theme} toggleTheme={toggleTheme} cartCount={cartCount} currentUser={currentUser} logout={logout} />
      <main className={currentUser ? "appMain" : ""}>
        <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route
            path="/restaurant/:id"
            element={<RestaurantDetail addToCart={addToCart} />}
          />
          <Route path="/checkout" element={<Checkout cartItems={cartItems} removeFromCart={removeFromCart} updateCartQuantity={updateCartQuantity} clearCart={clearCart} />} />
          <Route path="/order-confirmation/:id" element={requireAuth(<OrderReceipt />)} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/login" element={<Login currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
          <Route path="/register" element={<Register setCurrentUser={setCurrentUser} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={requireAuth(<Dashboard currentUser={currentUser} />)} />
          <Route path="/profile" element={requireAuth(<Profile currentUser={currentUser} />)} />
          <Route path="/admin" element={requireRole(<AdminDashboard />, ["admin"])} />
          <Route path="/admin/users" element={requireRole(<AdminUsers />, ["admin"])} />
          <Route path="/admin/owners" element={requireRole(<AdminOwners />, ["admin"])} />
          <Route path="/admin/customers" element={requireRole(<AdminCustomers />, ["admin"])} />
          <Route path="/admin/restaurants" element={requireRole(<AdminRestaurants />, ["admin"])} />
          <Route path="/admin/menus" element={requireRole(<AdminMenus />, ["admin"])} />
          <Route path="/admin/orders" element={requireRole(<AdminOrders />, ["admin"])} />
          <Route path="/owner" element={requireRole(<OwnerDashboard />, ["owner"])} />
          <Route path="/restaurants/manage" element={requireRole(<ManageRestaurants />, ["owner"])} />
          <Route path="/menu" element={requireRole(<ManageMenu />, ["owner"])} />
          <Route path="/orders" element={requireRole(<ManageOrders />, ["owner"])} />
          <Route path="/reservations/manage" element={requireRole(<ManageReservations />, ["owner"])} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </ErrorBoundary>
      </main>
      {!currentUser && <Footer />}
    </ToastProvider>
  );
}


export default App;
