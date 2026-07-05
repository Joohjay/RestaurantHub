import { useEffect, useMemo, useState } from "react";
import { AdminPageHeader, DataTable, LoadingState, ErrorState, SearchBar } from "../Components/admin";
import { API_URL } from "../config";
import "../App.css";

function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function fetchRestaurants() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/admin/restaurants`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        setError("Failed to load restaurants.");
        return;
      }

      const data = await response.json();
      setRestaurants(data);
    } catch (err) {
      setError("Unable to load restaurants. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const load = () => { fetchRestaurants(); };
    queueMicrotask(load);
  }, []);

  const filteredRestaurants = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return restaurants;
    return restaurants.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(term) ||
        (restaurant.category || "").toLowerCase().includes(term) ||
        (restaurant.location || "").toLowerCase().includes(term) ||
        (restaurant.owner_name || "").toLowerCase().includes(term)
    );
  }, [restaurants, search]);

  const columns = [
    { key: "id", label: "ID", render: (restaurant) => `#${restaurant.id}` },
    { key: "name", label: "Name", render: (restaurant) => restaurant.name },
    { key: "category", label: "Category", render: (restaurant) => restaurant.category || "Uncategorized" },
    { key: "location", label: "Location", render: (restaurant) => restaurant.location },
    { key: "owner", label: "Owner", render: (restaurant) => restaurant.owner_name || "No owner" },
    { key: "rating", label: "Rating", render: (restaurant) => restaurant.rating ? Number(restaurant.rating).toFixed(1) : "N/A" },
  ];

  if (loading) return <LoadingState message="Loading restaurants..." />;

  return (
    <div className="dashboardPage">
      <AdminPageHeader
        label="Administration"
        title="Manage Restaurants"
        subtitle="View all restaurants registered on the platform."
        backTo="/admin"
      />

      {error && <p className="authError">{error}</p>}

      <div className="adminControls">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search restaurants by name, category, location, or owner..."
        />
        <span className="adminCount">{filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? "s" : ""}</span>
      </div>

      <DataTable
        columns={columns}
        rows={filteredRestaurants}
        keyExtractor={(restaurant) => restaurant.id}
        emptyMessage="No restaurants found."
      />
    </div>
  );
}

export default AdminRestaurants;
