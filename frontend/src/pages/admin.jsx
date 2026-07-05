import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LuCalendarClock } from "react-icons/lu";
import StatusBadge from "../Components/StatusBadge";
import { API_URL } from "../config";
import { formatCurrency, formatPaymentMethod, formatScheduled } from "../utils/format";
import "../App.css";

function OwnerDashboard() {
  const [stats, setStats] = useState({
    restaurants: 0,
    totalOrders: 0,
    paidOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveryOrders: 0,
    reservations: 0,
  });
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchData() {
    try {
      const token = localStorage.getItem("token");
      const [ordersResponse, restaurantsResponse, reservationsResponse] = await Promise.all([
        fetch(`${API_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${API_URL}/api/restaurants/owner/mine`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${API_URL}/api/reservations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (!ordersResponse.ok || !restaurantsResponse.ok || !reservationsResponse.ok) {
        setError("Failed to load owner dashboard data.");
        return;
      }

      const data = await ordersResponse.json();
      const restaurantsData = await restaurantsResponse.json();
      const reservationsData = await reservationsResponse.json();

      setOrders(data);
      setReservations(reservationsData);

      const totalOrders = data.length;
      const paidOrders = data.filter(
        (order) => order.payment_status === "paid"
      ).length;
      const totalRevenue = data
        .filter((order) => order.payment_status === "paid")
        .reduce((sum, order) => sum + Number(order.total_price), 0);
      const pendingOrders = data.filter(
        (order) => order.status === "pending"
      ).length;
      const deliveryOrders = data.filter(
        (order) => order.is_delivery === true
      ).length;

      setStats({
        restaurants: restaurantsData.length,
        totalOrders,
        paidOrders,
        totalRevenue,
        pendingOrders,
        deliveryOrders,
        reservations: reservationsData.length,
      });
    } catch (err) {
      setError("Unable to load owner dashboard data. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const loadData = () => {
      fetchData();
    };

    queueMicrotask(loadData);
  }, []);

  if (loading) return <div className="dashboardPage"><p>Loading owner dashboard...</p></div>;

  return (
    <div className="dashboardPage">
      <div className="dashboardHeader">
        <div>
          <p className="dashboardLabel">Owner Dashboard</p>
          <h1>Operations overview.</h1>
          <p className="dashboardSubcopy">Manage your restaurants, menu, orders, and reservations from one place.</p>
        </div>
      </div>
      {error && <p className="authError">{error}</p>}

      <div className="pageFlow">
        <span className="flowStep active">Dashboard</span>
        <span className="flowArrow">→</span>
        <Link to="/restaurants/manage" className="flowStep">Manage Restaurants</Link>
        <span className="flowArrow">→</span>
        <Link to="/menu" className="flowStep">Manage Menu</Link>
        <span className="flowArrow">→</span>
        <Link to="/orders" className="flowStep">Manage Orders</Link>
        <span className="flowArrow">→</span>
        <Link to="/reservations/manage" className="flowStep">Manage Reservations</Link>
      </div>

      <div className="stats">
        <div className="statCard">
          <h1>{stats.restaurants}</h1>
          <p>Restaurants</p>
        </div>
        <div className="statCard">
          <h1>{stats.totalOrders}</h1>
          <p>Total Orders</p>
        </div>
        <div className="statCard">
          <h1>{stats.paidOrders}</h1>
          <p>Paid Orders</p>
        </div>
        <div className="statCard">
          <h1>{stats.pendingOrders}</h1>
          <p>Pending Orders</p>
        </div>
        <div className="statCard">
          <h1>{stats.deliveryOrders}</h1>
          <p>Delivery Orders</p>
        </div>
        <div className="statCard">
          <h1>{stats.reservations}</h1>
          <p>Reservations</p>
        </div>
        <div className="statCard">
          <h1>{formatCurrency(stats.totalRevenue)}</h1>
          <p>Total Revenue (Paid)</p>
        </div>
      </div>

      <div className="adminActions">
        <h2>Owner Actions</h2>
        <div className="actionButtons">
          <Link to="/restaurants/manage">
            <button className="primaryBtn">Manage Restaurants</button>
          </Link>
          <Link to="/menu">
            <button className="primaryBtn">Manage Menu</button>
          </Link>
          <Link to="/orders">
            <button className="primaryBtn">Manage Orders</button>
          </Link>
          <Link to="/reservations/manage">
            <button className="primaryBtn">Manage Reservations</button>
          </Link>
        </div>
      </div>

      <div className="allOrders">
        <h2>Reservations</h2>
        {reservations.length === 0 ? (
          <p>No reservations yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Reservation ID</th>
                <th>Restaurant</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Guests</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reservations.slice(0, 6).map((reservation) => (
                <tr key={reservation.id}>
                  <td>#{reservation.id}</td>
                  <td>{reservation.restaurant_name || reservation.restaurant_id}</td>
                  <td>{reservation.customer_name || reservation.customer_email || reservation.user_id}</td>
                  <td>{new Date(reservation.reservation_date).toLocaleDateString()}</td>
                  <td>{reservation.guests}</td>
                  <td>{reservation.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="allOrders">
        <h2>All Orders</h2>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Method</th>
                <th>Type</th>
                <th>Scheduled</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{formatCurrency(order.total_price)}</td>
                  <td>
                    <StatusBadge value={order.status} />
                  </td>
                  <td>
                    <StatusBadge value={order.payment_status} />
                  </td>
                  <td>{formatPaymentMethod(order.payment_method)}</td>
                  <td>{order.is_delivery ? "Delivery" : "Pickup"}</td>
                  <td>
                    <LuCalendarClock size={14} style={{ verticalAlign: "middle" }} />{" "}
                    {formatScheduled(order.scheduled_date, order.scheduled_time)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default OwnerDashboard;
