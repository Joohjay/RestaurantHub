import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config";
import { resolveMenuImage } from "../utils/menuImages";
import "../App.css";

const emptyMenuForm = {
  name: "",
  description: "",
  price: "",
  image: "",
  available: true,
};

function ManageMenu() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [formData, setFormData] = useState(emptyMenuForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function fetchOwnerRestaurants() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/restaurants/owner/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        setError("Failed to load your restaurants.");
        return;
      }

      const data = await response.json();
      setRestaurants(data);
      setSelectedRestaurantId(data[0]?.id || "");
    } catch (err) {
      setError("Unable to load restaurants. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMenuItems(restaurantId) {
    if (!restaurantId) {
      setMenuItems([]);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/restaurants/${restaurantId}/menu`);
      if (!response.ok) {
        setError("Failed to load menu items.");
        return;
      }

      const data = await response.json();
      setMenuItems(data);
    } catch (err) {
      setError("Unable to load menu items. Please try again later.");
      console.error(err);
    }
  }

  useEffect(() => {
    const loadOwnerRestaurants = () => {
      fetchOwnerRestaurants();
    };

    queueMicrotask(loadOwnerRestaurants);
  }, []);

  useEffect(() => {
    const loadMenuItems = () => {
      fetchMenuItems(selectedRestaurantId);
    };

    queueMicrotask(loadMenuItems);
  }, [selectedRestaurantId]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(emptyMenuForm);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name || "",
      description: item.description || "",
      price: item.price || "",
      image: item.image || "",
      available: item.available !== false,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        editingId ? `${API_URL}/api/menu/${editingId}` : `${API_URL}/api/restaurants/${selectedRestaurantId}/menu`,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Failed to save menu item.");
        return;
      }

      if (editingId) {
        setMenuItems((current) => current.map((item) => item.id === editingId ? data : item));
      } else {
        setMenuItems((current) => [...current, data]);
      }
      resetForm();
    } catch (err) {
      setError("Unable to save menu item. Please try again later.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (itemId) => {
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/menu/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to delete menu item.");
        return;
      }

      setMenuItems((current) => current.filter((item) => item.id !== itemId));
    } catch (err) {
      setError("Unable to delete menu item. Please try again later.");
      console.error(err);
    }
  };

  return (
    <div className="dashboardPage">
      <div className="dashboardHeader">
        <div>
          <p className="dashboardLabel">Management</p>
          <h1>Manage Menu</h1>
          <p className="dashboardSubcopy">Add, edit, and organize menu items for your restaurants.</p>
        </div>
      </div>
      <div className="pageFlow">
        <Link to="/owner" className="flowStep">Dashboard</Link>
        <span className="flowArrow">→</span>
        <Link to="/restaurants/manage" className="flowStep">Manage Restaurants</Link>
        <span className="flowArrow">→</span>
        <span className="flowStep active">Manage Menu</span>
        <span className="flowArrow">→</span>
        <Link to="/orders" className="flowStep">Manage Orders</Link>
        <span className="flowArrow">&gt;</span>
        <Link to="/reservations/manage" className="flowStep">Manage Reservations</Link>
      </div>

      {error && <p className="authError">{error}</p>}

      {loading ? (
        <p>Loading restaurants...</p>
      ) : restaurants.length === 0 ? (
        <p>Create a restaurant before adding menu items.</p>
      ) : (
        <>
          <label className="inlineField">
            Restaurant
            <select value={selectedRestaurantId} onChange={(event) => setSelectedRestaurantId(event.target.value)}>
              {restaurants.map((restaurant) => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
          </label>

          <form className="authForm managementForm" onSubmit={handleSubmit}>
            <label>
              Item name
              <input name="name" value={formData.name} onChange={handleChange} required />
            </label>
            <label>
              Price
              <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
            </label>
            <label>
              Description
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
            </label>
            <label>
              Image URL
              <input name="image" value={formData.image} onChange={handleChange} />
            </label>
            <label className="checkboxLabel">
              <input name="available" type="checkbox" checked={formData.available} onChange={handleChange} />
              Available
            </label>
            <button type="submit" className="authButton" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update Item" : "Create Item"}
            </button>
            {editingId && (
              <button type="button" className="secondaryBtn" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </form>

          <div className="menuGrid">
            {menuItems.map((item) => (
              <div key={item.id} className="menuItem">
                {resolveMenuImage(item.name, item.image) && (
                  <img
                    src={`/images/${encodeURIComponent(resolveMenuImage(item.name, item.image))}`}
                    alt={item.name}
                    className="menuItemImg"
                    loading="lazy"
                    style={{ maxWidth: "100%", borderRadius: "8px", marginBottom: "8px" }}
                  />
                )}
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <p>Tsh {Number(item.price).toLocaleString()}</p>
                  <p>{item.available === false ? "Unavailable" : "Available"}</p>
                </div>
                <div className="cartActions">
                  <button className="secondaryBtn" onClick={() => startEdit(item)}>Edit</button>
                  <button className="secondaryBtn" onClick={() => handleDelete(item.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ManageMenu;
