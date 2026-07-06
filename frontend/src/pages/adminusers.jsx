import { useEffect, useMemo, useState } from "react";
import StatusBadge from "../Components/StatusBadge";
import { AdminPageHeader, DataTable, LoadingState, ErrorState, SearchBar } from "../Components/admin";
import { API_URL } from "../config";
import "../App.css";

const roleOptions = ["customer", "owner", "admin"];

function formatDate(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString();
}

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingUserId, setSavingUserId] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function fetchUsers() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        setError("Failed to load users.");
        return;
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError("Unable to load users. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const load = () => { fetchUsers(); };
    queueMicrotask(load);
  }, []);

  const updateRole = async (userId, role) => {
    try {
      setSavingUserId(userId);
      setError("");
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Failed to update user role.");
        return;
      }

      setUsers((current) => current.map((user) => user.id === userId ? data : user));
    } catch (err) {
      setError("Unable to update role. Please try again later.");
      console.error(err);
    } finally {
      setSavingUserId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term)
    );
  }, [users, search]);

  const columns = [
    { key: "id", label: "ID", render: (user) => `#${user.id}` },
    { key: "name", label: "Name", render: (user) => user.name },
    { key: "email", label: "Email", render: (user) => user.email },
    { key: "phone", label: "Phone", render: (user) => user.phone || "—" },
    { key: "role", label: "Role", render: (user) => <StatusBadge value={user.role} /> },
    {
      key: "changeRole",
      label: "Change Role",
      render: (user) => (
        <select
          value={user.role}
          disabled={savingUserId === user.id}
          onChange={(event) => updateRole(user.id, event.target.value)}
        >
          {roleOptions.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      ),
    },
    { key: "joined", label: "Joined", render: (user) => formatDate(user.created_at) },
  ];

  if (loading) return <LoadingState message="Loading users..." />;

  return (
    <div className="dashboardPage">
      <AdminPageHeader
        label="Administration"
        title="Manage Users"
        subtitle="View all platform users and assign roles."
        backTo="/admin"
      />

      {error && <p className="authError">{error}</p>}

      <div className="adminControls">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search users by name, email, or role..."
        />
        <span className="adminCount">{filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}</span>
      </div>

      <DataTable
        columns={columns}
        rows={filteredUsers}
        keyExtractor={(user) => user.id}
        emptyMessage="No users found."
      />
    </div>
  );
}

export default AdminUsers;
