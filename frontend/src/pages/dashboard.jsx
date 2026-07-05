import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LuCalendarClock } from "react-icons/lu";
import StatusBadge from "../Components/StatusBadge";
import { API_URL } from "../config";
import { formatCurrency, formatPaymentMethod, formatScheduled } from "../utils/format";
import "../App.css";

function Dashboard({ currentUser }) {
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const token = localStorage.getItem("token");
        const [ordersResponse, reservationsResponse] = await Promise.all([
          fetch(`${API_URL}/api/orders`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/reservations`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!ordersResponse.ok || !reservationsResponse.ok) {
          setError("Failed to load dashboard data.");
          return;
        }

        setOrders(await ordersResponse.json());
        setReservations(await reservationsResponse.json());
      } catch (err) {
        setError("Unable to load dashboard data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    const loadDashboardData = () => {
      fetchDashboardData();
    };

    queueMicrotask(loadDashboardData);
  }, []);

  const stats = useMemo(() => {
    const activeOrders = orders.filter((order) => !["delivered", "completed", "cancelled"].includes(order.status));
    const unpaidOrders = orders.filter((order) => order.payment_status !== "paid");
    const upcomingReservations = reservations.filter((reservation) => reservation.status !== "cancelled");
    const totalSpend = orders.reduce((sum, order) => sum + Number(order.total_price || 0), 0);

    return {
      activeOrders: activeOrders.length,
      unpaidOrders: unpaidOrders.length,
      upcomingReservations: upcomingReservations.length,
      totalSpend,
    };
  }, [orders, reservations]);

  if (loading) return <div className="dashboardPage"><p>Loading dashboard...</p></div>;

  return (
    <div className="dashboardPage">
      <div className="dashboardHeader">
        <div>
          <p className="dashboardLabel">Account Dashboard</p>
          <h1>Welcome back, {currentUser?.name || "customer"}.</h1>
          <p className="dashboardSubcopy">Track your orders, reservations, payments, and profile from one workspace.</p>
        </div>
        <div className="dashboardActions">
          <Link to="/restaurants">
            <button className="primaryBtn">Order Food</button>
          </Link>
          <Link to="/reservation">
            <button className="secondaryBtn">Reserve Table</button>
          </Link>
        </div>
      </div>

      {error && <p className="authError">{error}</p>}

      <div className="dashboardGrid">
        <div className="statusCard">
          <p>ACTIVE ORDERS</p>
          <h2>{stats.activeOrders}</h2>
          <span>Orders still being prepared or delivered</span>
        </div>
        <div className="statusCard">
          <p>RESERVATIONS</p>
          <h2>{stats.upcomingReservations}</h2>
          <span>Upcoming or pending table bookings</span>
        </div>
        <div className="statusCard">
          <p>UNPAID ORDERS</p>
          <h2>{stats.unpaidOrders}</h2>
          <span>Cash and mobile money payments to complete</span>
        </div>
        <div className="statusCard">
          <p>TOTAL SPEND</p>
          <h2>{formatCurrency(stats.totalSpend)}</h2>
          <span>Across your order history</span>
        </div>
      </div>

      <div className="overviewSection">
        <div className="overviewCard">
          <div className="overviewCardHeader">
            <h2>Recent Orders</h2>
            <Link to="/profile">View all</Link>
          </div>
          {orders.length === 0 ? (
            <p className="mutedText">No orders yet. Browse restaurants to place your first order.</p>
          ) : (
            <div className="dashboardList">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="dashboardListRow">
                  <div>
                    <strong>Order #{order.id}</strong>
                    <p>{formatPaymentMethod(order.payment_method)} payment</p>
                    <p className="mutedText scheduleHint">
                      <LuCalendarClock size={12} /> {formatScheduled(order.scheduled_date, order.scheduled_time)}
                    </p>
                  </div>
                  <span>{formatCurrency(order.total_price)}</span>
                  <StatusBadge value={order.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="overviewCard">
          <div className="overviewCardHeader">
            <h2>Reservations</h2>
            <Link to="/reservation">Book table</Link>
          </div>
          {reservations.length === 0 ? (
            <p className="mutedText">No reservations yet. Reserve a table at any available restaurant.</p>
          ) : (
            <div className="dashboardList">
              {reservations.slice(0, 5).map((reservation) => (
                <div key={reservation.id} className="dashboardListRow compact">
                  <div>
                    <strong>{reservation.restaurant_name || `Restaurant #${reservation.restaurant_id}`}</strong>
                    <p>{new Date(reservation.reservation_date).toLocaleDateString()} at {reservation.reservation_time}</p>
                  </div>
                  <StatusBadge value={reservation.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
