import { useEffect, useMemo, useState } from "react";
import { LuUsers, LuStore, LuClipboardList, LuCalendarDays, LuTrendingUp, LuWallet } from "react-icons/lu";
import StatusBadge from "../Components/StatusBadge";
import { AdminNavCard, StatCard, LoadingState, ErrorState } from "../Components/admin";
import { API_URL } from "../config";
import { formatCurrency } from "../utils/format";
import "../App.css";

function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchAdminData() {
    try {
      const token = localStorage.getItem("token");
      const [summaryResponse, usersResponse, restaurantsResponse] = await Promise.all([
        fetch(`${API_URL}/api/admin/summary`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/admin/restaurants`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (!summaryResponse.ok || !usersResponse.ok || !restaurantsResponse.ok) {
        setError("Failed to load admin dashboard.");
        return;
      }

      setSummary(await summaryResponse.json());
      setUsers(await usersResponse.json());
      setRestaurants(await restaurantsResponse.json());
    } catch (err) {
      setError("Unable to load admin dashboard. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const loadAdminData = () => {
      fetchAdminData();
    };

    queueMicrotask(loadAdminData);
  }, []);

  const stats = useMemo(() => {
    const usersByRole = summary?.usersByRole || {};
    const ordersByStatus = summary?.ordersByStatus || {};
    const reservationsByStatus = summary?.reservationsByStatus || {};

    return {
      users: Object.values(usersByRole).reduce((sum, value) => sum + Number(value || 0), 0),
      owners: usersByRole.owner || 0,
      customers: usersByRole.customer || 0,
      restaurants: summary?.restaurants || 0,
      activeOrders: Object.entries(ordersByStatus)
        .filter(([status]) => !["completed", "delivered", "cancelled"].includes(status))
        .reduce((sum, [, value]) => sum + Number(value || 0), 0),
      reservations: Object.values(reservationsByStatus).reduce((sum, value) => sum + Number(value || 0), 0),
      revenue: summary?.paidRevenue || 0,
    };
  }, [summary]);

  if (loading) return <LoadingState message="Loading admin dashboard..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="dashboardPage adminDashboard">
      <div className="dashboardHeader">
        <div>
          <p className="dashboardLabel">Admin Dashboard</p>
          <h1>Platform control center.</h1>
          <p className="dashboardSubcopy">Manage users, restaurants, orders, and platform health from one clean workspace.</p>
        </div>
      </div>

      <div className="dashboardGrid">
        <StatCard label="TOTAL USERS" value={stats.users} hint={`${stats.customers} customers, ${stats.owners} owners`} />
        <StatCard label="RESTAURANTS" value={stats.restaurants} hint="Restaurants stored in PostgreSQL" />
        <StatCard label="ACTIVE ORDERS" value={stats.activeOrders} hint="Pending, preparing, or ready" accent />
        <StatCard label="PAID REVENUE" value={formatCurrency(stats.revenue)} hint="From paid orders" />
      </div>

      <div className="adminOverviewGrid">
        <AdminNavCard
          to="/admin/users"
          icon={<LuUsers size={28} />}
          title="Users"
          subtitle={`${users.length} accounts registered`}
        >
          {users.slice(0, 4).map((user) => (
            <div key={user.id} className="dashboardListRow">
              <div>
                <strong>{user.name}</strong>
                <p>{user.email}</p>
              </div>
              <StatusBadge value={user.role} />
            </div>
          ))}
        </AdminNavCard>

        <AdminNavCard
          to="/admin/restaurants"
          icon={<LuStore size={28} />}
          title="Restaurants"
          subtitle={`${restaurants.length} listed`}
        >
          {restaurants.slice(0, 4).map((restaurant) => (
            <div key={restaurant.id} className="dashboardListRow">
              <div>
                <strong>{restaurant.name}</strong>
                <p>{restaurant.category || "Uncategorized"} - {restaurant.location}</p>
              </div>
              <span>{restaurant.rating ? Number(restaurant.rating).toFixed(1) : "N/A"}</span>
            </div>
          ))}
        </AdminNavCard>

        <AdminNavCard
          to="/admin/orders"
          icon={<LuClipboardList size={28} />}
          title="Orders"
          subtitle={`${stats.activeOrders} active`}
        >
          {summary?.recentOrders?.slice(0, 4).map((order) => (
            <div key={order.id} className="dashboardListRow">
              <div>
                <strong>Order #{order.id}</strong>
                <p>{order.restaurant_name || "Restaurant"} - {order.customer_name || "Customer"}</p>
              </div>
              <span>{formatCurrency(order.total_price)}</span>
              <StatusBadge value={order.status} />
            </div>
          ))}
        </AdminNavCard>

        <div className="overviewCard adminQuickStats">
          <div className="overviewCardHeader">
            <h2>Quick Overview</h2>
          </div>
          <div className="adminQuickStatsGrid">
            <div className="adminQuickStat">
              <LuCalendarDays size={22} />
              <div>
                <strong>{stats.reservations}</strong>
                <span>Reservations</span>
              </div>
            </div>
            <div className="adminQuickStat">
              <LuTrendingUp size={22} />
              <div>
                <strong>{summary?.recentOrders?.length || 0}</strong>
                <span>Recent Orders</span>
              </div>
            </div>
            <div className="adminQuickStat">
              <LuWallet size={22} />
              <div>
                <strong>{formatCurrency(stats.revenue)}</strong>
                <span>Total Revenue</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
