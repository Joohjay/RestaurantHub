import { useEffect, useMemo, useState } from "react";
import { AdminPageHeader, DataTable, LoadingState, SearchBar } from "../Components/admin";
import { API_URL } from "../config";
import "../App.css";

function formatDate(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString();
}

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function fetchCustomers() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/admin/customers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        setError("Failed to load customers.");
        return;
      }

      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      setError("Unable to load customers. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const load = () => { fetchCustomers(); };
    queueMicrotask(load);
  }, []);

  const filteredCustomers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return customers;
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term) ||
        (customer.phone || "").toLowerCase().includes(term)
    );
  }, [customers, search]);

  const columns = [
    { key: "id", label: "ID", render: (customer) => `#${customer.id}` },
    { key: "name", label: "Name", render: (customer) => customer.name },
    { key: "email", label: "Email", render: (customer) => customer.email },
    { key: "phone", label: "Phone", render: (customer) => customer.phone || "—" },
    { key: "orders", label: "Orders", render: (customer) => customer.order_count },
    { key: "joined", label: "Joined", render: (customer) => formatDate(customer.created_at) },
  ];

  if (loading) return <LoadingState message="Loading customers..." />;

  return (
    <div className="dashboardPage">
      <AdminPageHeader
        label="Administration"
        title="Manage Customers"
        subtitle="View all customers registered on the platform."
        backTo="/admin"
      />

      {error && <p className="authError">{error}</p>}

      <div className="adminControls">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search customers by name, email, or phone..."
        />
        <span className="adminCount">{filteredCustomers.length} customer{filteredCustomers.length !== 1 ? "s" : ""}</span>
      </div>

      <DataTable
        columns={columns}
        rows={filteredCustomers}
        keyExtractor={(customer) => customer.id}
        emptyMessage="No customers found."
      />
    </div>
  );
}

export default AdminCustomers;
