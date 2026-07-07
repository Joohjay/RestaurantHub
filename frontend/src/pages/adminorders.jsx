import { useEffect, useMemo, useState } from "react";
import { LuCalendarClock } from "react-icons/lu";
import StatusBadge from "../Components/StatusBadge";
import { AdminPageHeader, DataTable, LoadingState, SearchBar } from "../Components/admin";
import { API_URL } from "../config";
import { formatCurrency, formatPaymentMethod, formatScheduled } from "../utils/format";
import "../App.css";

const orderStatuses = ["pending", "preparing", "ready", "delivered", "completed", "cancelled"];
const paymentStatuses = ["pending", "unpaid", "paid", "failed", "refunded"];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [newPaymentStatus, setNewPaymentStatus] = useState("");

  async function fetchOrders() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        setError("Failed to load orders.");
        return;
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError("Unable to load orders. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const load = () => { fetchOrders(); };
    queueMicrotask(load);
  }, []);

  const handleUpdateOrder = async (orderId, updates) => {
    try {
      setError("");
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        setError("Failed to update order.");
        return;
      }

      const updatedOrder = await response.json();
      setOrders((prevOrders) =>
        prevOrders.map((order) => order.id === orderId ? updatedOrder : order)
      );
      setUpdatingOrderId(null);
    } catch (err) {
      setError("Unable to update order. Please try again later.");
      console.error(err);
    }
  };

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return orders;
    return orders.filter(
      (order) =>
        String(order.id).includes(term) ||
        String(order.restaurant_name || order.restaurant_id).toLowerCase().includes(term) ||
        (order.status || "").toLowerCase().includes(term) ||
        (order.payment_status || "").toLowerCase().includes(term)
    );
  }, [orders, search]);

  const columns = [
    { key: "id", label: "Order ID", render: (order) => `#${order.id}` },
    { key: "restaurant", label: "Restaurant", render: (order) => order.restaurant_name || order.restaurant_id },
    { key: "customer", label: "Customer", render: (order) => order.user_id },
    { key: "total", label: "Total", render: (order) => formatCurrency(order.total_price) },
    { key: "status", label: "Status", render: (order) => <StatusBadge value={order.status} /> },
    { key: "payment", label: "Payment", render: (order) => <StatusBadge value={order.payment_status} /> },
    { key: "method", label: "Method", render: (order) => formatPaymentMethod(order.payment_method) },
    {
      key: "scheduled",
      label: "Scheduled",
      render: (order) => (
        <>
          <LuCalendarClock size={14} style={{ verticalAlign: "middle" }} />{" "}
          {formatScheduled(order.scheduled_date, order.scheduled_time)}
        </>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (order) => (
        <button
          className="secondaryBtn"
          onClick={() => {
            setSelectedOrder(order);
            setUpdatingOrderId(order.id);
            setNewStatus(order.status);
            setNewPaymentStatus(order.payment_status);
          }}
        >
          Edit
        </button>
      ),
    },
  ];

  if (loading) return <LoadingState message="Loading orders..." />;

  return (
    <div className="dashboardPage">
      <AdminPageHeader
        label="Administration"
        title="Manage Orders"
        subtitle="View and update all platform orders."
        backTo="/admin"
      />

      {error && <p className="authError">{error}</p>}

      <div className="adminControls">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search orders by ID, restaurant, status, or payment..."
        />
        <span className="adminCount">{filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}</span>
      </div>

      <DataTable
        columns={columns}
        rows={filteredOrders}
        keyExtractor={(order) => order.id}
        emptyMessage="No orders found."
      />

      {updatingOrderId && selectedOrder && (
        <>
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              zIndex: 1000,
              minWidth: "300px",
            }}
          >
            <h3>Update Order #{selectedOrder.id}</h3>
            <label>
              Order Status
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                {orderStatuses.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </label>
            <label>
              Payment Status
              <select value={newPaymentStatus} onChange={(e) => setNewPaymentStatus(e.target.value)}>
                {paymentStatuses.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </label>
            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button
                className="authButton"
                onClick={() =>
                  handleUpdateOrder(updatingOrderId, {
                    status: newStatus,
                    payment_status: newPaymentStatus,
                  })
                }
              >
                Save
              </button>
              <button className="secondaryBtn" onClick={() => setUpdatingOrderId(null)}>
                Cancel
              </button>
            </div>
          </div>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 999,
            }}
            onClick={() => setUpdatingOrderId(null)}
          />
        </>
      )}
    </div>
  );
}

export default AdminOrders;
