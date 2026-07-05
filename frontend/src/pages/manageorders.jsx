import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LuCalendarClock } from "react-icons/lu";
import StatusBadge from "../Components/StatusBadge";
import { API_URL } from "../config";
import { formatCurrency, formatPaymentMethod, formatScheduled } from "../utils/format";
import "../App.css";

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [newPaymentStatus, setNewPaymentStatus] = useState("");

  async function fetchOrders() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    const loadOrders = () => {
      fetchOrders();
    };

    queueMicrotask(loadOrders);
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
        prevOrders.map((order) =>
          order.id === orderId ? updatedOrder : order
        )
      );
      setUpdatingOrderId(null);
    } catch (err) {
      setError("Unable to update order. Please try again later.");
      console.error(err);
    }
  };

  const hasCoordinates = (order) =>
    order.delivery_latitude !== null &&
    order.delivery_latitude !== undefined &&
    order.delivery_longitude !== null &&
    order.delivery_longitude !== undefined;

  const formatCoordinate = (value) => Number(value).toFixed(4);

  if (loading) return <div className="dashboardPage"><p>Loading orders...</p></div>;

  return (
    <div className="dashboardPage">
      <div className="dashboardHeader">
        <div>
          <p className="dashboardLabel">Management</p>
          <h1>Manage Orders</h1>
          <p className="dashboardSubcopy">Track, update, and fulfill customer orders in real time.</p>
        </div>
      </div>
      {error && <p className="authError">{error}</p>}

      <div className="pageFlow">
        <Link to="/owner" className="flowStep">Dashboard</Link>
        <span className="flowArrow">→</span>
        <Link to="/menu" className="flowStep">Manage Menu</Link>
        <span className="flowArrow">→</span>
        <span className="flowStep active">Manage Orders</span>
        <span className="flowArrow">&gt;</span>
        <Link to="/reservations/manage" className="flowStep">Manage Reservations</Link>
      </div>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="ordersTable">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Restaurant</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Method</th>
                <th>Delivery</th>
                <th>Scheduled</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.restaurant_id}</td>
                  <td>{formatCurrency(order.total_price)}</td>
                  <td>
                    <StatusBadge value={order.status} />
                  </td>
                  <td>
                    <StatusBadge value={order.payment_status} />
                  </td>
                  <td>{formatPaymentMethod(order.payment_method)}</td>
                  <td>
                    {order.is_delivery ? (
                      <>
                        <span>Location: {order.delivery_address}</span>
                        {hasCoordinates(order) && (
                          <p style={{ fontSize: "11px", margin: "2px 0" }}>
                            {formatCoordinate(order.delivery_latitude)},{" "}
                            {formatCoordinate(order.delivery_longitude)}
                          </p>
                        )}
                      </>
                    ) : (
                      "Pickup"
                    )}
                  </td>
                  <td>
                    <LuCalendarClock size={14} style={{ verticalAlign: "middle" }} />{" "}
                    {formatScheduled(order.scheduled_date, order.scheduled_time)}
                  </td>
                  <td>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {updatingOrderId && selectedOrder && (
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
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
          <label>
            Payment Status
            <select
              value={newPaymentStatus}
              onChange={(e) => setNewPaymentStatus(e.target.value)}
            >
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
            </select>
          </label>
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "15px",
            }}
          >
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
            <button
              className="secondaryBtn"
              onClick={() => setUpdatingOrderId(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {updatingOrderId && (
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
      )}
    </div>
  );
}

export default ManageOrders;
