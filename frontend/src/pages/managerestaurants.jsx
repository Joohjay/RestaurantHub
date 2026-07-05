import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LuStore } from "react-icons/lu";
import { API_URL } from "../config";
import "../App.css";

const emptyForm = {
  name: "",
  description: "",
  location: "",
  category: "",
  rating: "",
  emoji: "",
  latitude: "",
  longitude: "",
};

function ManageRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function fetchRestaurants() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/restaurants/owner/mine`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setError("Failed to load your restaurants.");
        return;
      }

      const data = await response.json();
      setRestaurants(data);
    } catch (err) {
      setError("Unable to load your restaurants. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const loadRestaurants = () => {
      fetchRestaurants();
    };

    queueMicrotask(loadRestaurants);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const startEdit = (restaurant) => {
    setEditingId(restaurant.id);
    setFormData({
      name: restaurant.name || "",
      description: restaurant.description || "",
      location: restaurant.location || "",
      category: restaurant.category || "",
      rating: restaurant.rating || "",
      emoji: restaurant.emoji || "",
      latitude: restaurant.latitude || "",
      longitude: restaurant.longitude || "",
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        editingId ? `${API_URL}/api/restaurants/${editingId}` : `${API_URL}/api/restaurants`,
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
        setError(data.message || "Failed to save restaurant.");
        return;
      }

      if (editingId) {
        setRestaurants((current) => current.map((restaurant) => restaurant.id === editingId ? data : restaurant));
      } else {
        setRestaurants((current) => [...current, data]);
      }
      resetForm();
    } catch (err) {
      setError("Unable to save restaurant. Please try again later.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (restaurantId) => {
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/restaurants/${restaurantId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to delete restaurant.");
        return;
      }

      setRestaurants((current) => current.filter((restaurant) => restaurant.id !== restaurantId));
    } catch (err) {
      setError("Unable to delete restaurant. Please try again later.");
      console.error(err);
    }
  };

  return (
    <div className="dashboardPage">
      <div className="dashboardHeader">
        <div>
          <p className="dashboardLabel">Management</p>
          <h1>Manage Restaurants</h1>
          <p className="dashboardSubcopy">Create, edit, and remove your restaurant listings.</p>
        </div>
      </div>
      <div className="pageFlow">
        <Link to="/owner" className="flowStep">Dashboard</Link>
        <span className="flowArrow">→</span>
        <span className="flowStep active">Manage Restaurants</span>
        <span className="flowArrow">→</span>
        <Link to="/menu" className="flowStep">Manage Menu</Link>
        <span className="flowArrow">→</span>
        <Link to="/orders" className="flowStep">Manage Orders</Link>
        <span className="flowArrow">&gt;</span>
        <Link to="/reservations/manage" className="flowStep">Manage Reservations</Link>
      </div>

      {error && <p className="authError">{error}</p>}

      <form className="authForm managementForm" onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <label>
          Category
          <input name="category" value={formData.category} onChange={handleChange} />
        </label>
        <label>
          Location
          <input name="location" value={formData.location} onChange={handleChange} required />
        </label>
        <label>
          Rating
          <input name="rating" type="number" step="0.1" value={formData.rating} onChange={handleChange} />
        </label>
        <label>
          Latitude
          <input name="latitude" type="number" step="0.00000001" value={formData.latitude} onChange={handleChange} />
        </label>
        <label>
          Longitude
          <input name="longitude" type="number" step="0.00000001" value={formData.longitude} onChange={handleChange} />
        </label>
        <label>
          Description
          <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
        </label>
        <button type="submit" className="authButton" disabled={saving}>
          {saving ? "Saving..." : editingId ? "Update Restaurant" : "Create Restaurant"}
        </button>
        {editingId && (
          <button type="button" className="secondaryBtn" onClick={resetForm}>
            Cancel Edit
          </button>
        )}
      </form>

      {loading ? (
        <p>Loading restaurants...</p>
      ) : (
        <div className="menuGrid">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="menuItem">
              <div>
                <h2><LuStore size={24} style={{ verticalAlign: "middle", marginRight: "8px" }} /> {restaurant.name}</h2>
                <p>{restaurant.category} • {restaurant.location}</p>
                <p>{restaurant.description}</p>
              </div>
              <div className="cartActions">
                <button className="secondaryBtn" onClick={() => startEdit(restaurant)}>Edit</button>
                <button className="secondaryBtn" onClick={() => handleDelete(restaurant.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageRestaurants;
