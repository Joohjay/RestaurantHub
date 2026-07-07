import { useEffect, useMemo, useState } from "react";
import { AdminPageHeader, DataTable, LoadingState, SearchBar } from "../Components/admin";
import StatusBadge from "../Components/StatusBadge";
import { API_URL } from "../config";
import { formatCurrency } from "../utils/format";
import "../App.css";

function AdminMenus() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function fetchMenus() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/admin/menus`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        setError("Failed to load menu items.");
        return;
      }

      const data = await response.json();
      setMenus(data);
    } catch (err) {
      setError("Unable to load menu items. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const load = () => { fetchMenus(); };
    queueMicrotask(load);
  }, []);

  const filteredMenus = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return menus;
    return menus.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        (item.restaurant_name || "").toLowerCase().includes(term) ||
        (item.description || "").toLowerCase().includes(term)
    );
  }, [menus, search]);

  const columns = [
    { key: "id", label: "ID", render: (item) => `#${item.id}` },
    { key: "name", label: "Item", render: (item) => item.name },
    { key: "restaurant", label: "Restaurant", render: (item) => item.restaurant_name || "N/A" },
    { key: "description", label: "Description", render: (item) => item.description || "—" },
    { key: "price", label: "Price", render: (item) => formatCurrency(item.price) },
    {
      key: "available",
      label: "Available",
      render: (item) => <StatusBadge value={item.available ? "available" : "unavailable"} />,
    },
  ];

  if (loading) return <LoadingState message="Loading menu items..." />;

  return (
    <div className="dashboardPage">
      <AdminPageHeader
        label="Administration"
        title="Manage Menus"
        subtitle="View every menu item across all restaurants."
        backTo="/admin"
      />

      {error && <p className="authError">{error}</p>}

      <div className="adminControls">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search menu items by name, restaurant, or description..."
        />
        <span className="adminCount">{filteredMenus.length} item{filteredMenus.length !== 1 ? "s" : ""}</span>
      </div>

      <DataTable
        columns={columns}
        rows={filteredMenus}
        keyExtractor={(item) => item.id}
        emptyMessage="No menu items found."
      />
    </div>
  );
}

export default AdminMenus;
