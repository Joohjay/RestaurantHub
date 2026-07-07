import { useEffect, useMemo, useState } from "react";
import { AdminPageHeader, DataTable, LoadingState, SearchBar } from "../Components/admin";
import { API_URL } from "../config";
import "../App.css";

function formatDate(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString();
}

function AdminOwners() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function fetchOwners() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/admin/owners`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        setError("Failed to load owners.");
        return;
      }

      const data = await response.json();
      setOwners(data);
    } catch (err) {
      setError("Unable to load owners. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const load = () => { fetchOwners(); };
    queueMicrotask(load);
  }, []);

  const filteredOwners = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return owners;
    return owners.filter(
      (owner) =>
        owner.name.toLowerCase().includes(term) ||
        owner.email.toLowerCase().includes(term) ||
        (owner.phone || "").toLowerCase().includes(term)
    );
  }, [owners, search]);

  const columns = [
    { key: "id", label: "ID", render: (owner) => `#${owner.id}` },
    { key: "name", label: "Name", render: (owner) => owner.name },
    { key: "email", label: "Email", render: (owner) => owner.email },
    { key: "phone", label: "Phone", render: (owner) => owner.phone || "—" },
    { key: "restaurants", label: "Restaurants", render: (owner) => owner.restaurant_count },
    { key: "joined", label: "Joined", render: (owner) => formatDate(owner.created_at) },
  ];

  if (loading) return <LoadingState message="Loading owners..." />;

  return (
    <div className="dashboardPage">
      <AdminPageHeader
        label="Administration"
        title="Manage Owners"
        subtitle="View all restaurant owners on the platform."
        backTo="/admin"
      />

      {error && <p className="authError">{error}</p>}

      <div className="adminControls">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search owners by name, email, or phone..."
        />
        <span className="adminCount">{filteredOwners.length} owner{filteredOwners.length !== 1 ? "s" : ""}</span>
      </div>

      <DataTable
        columns={columns}
        rows={filteredOwners}
        keyExtractor={(owner) => owner.id}
        emptyMessage="No owners found."
      />
    </div>
  );
}

export default AdminOwners;
