import { useEffect, useMemo, useState } from "react";
import {
  LuUsers, LuStore, LuClipboardList, LuCalendarDays, LuTrendingUp, LuWallet, LuNotebookText, LuUserCheck
} from "react-icons/lu";
import StatusBadge from "../Components/StatusBadge";
import { AdminNavCard, StatCard, LoadingState, ErrorState } from "../Components/admin";
import { API_URL } from "../config";
import { formatCurrency } from "../utils/format";
import "../App.css";

function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [owners, setOwners] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchAdminData() {
    try {
      const token = localStorage.getItem("token");
      const [
        summaryResponse,
        ownersResponse,
        customersResponse,
        restaurantsResponse,
        menusResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/api/admin/summary`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/admin/owners`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/admin/customers`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/admin/restaurants`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/admin/menus`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (
        !summaryResponse.ok ||
        !ownersResponse.ok ||
        !customersResponse.ok ||
        !restaurantsResponse.ok ||
        !menusResponse.ok
      ) {
        setError("Failed to load admin dashboard.");
        return;
      }

      setSummary(await summaryResponse.json());
      setOwners(await ownersResponse.json());
      setCustomers(await customersResponse.json());
      setRestaurants(await restaurantsResponse.json());
      setMenus(await menusResponse.json());
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
      menus: menus.length,
      activeOrders: Object.entries(ordersByStatus)
        .filter(([status]) => !["completed", "delivered", "cancelled"].includes(status))
        .reduce((sum, [, value]) => sum + Number(value || 0), 0),
      reservations: Object.values(reservationsByStatus).reduce((sum, value) => sum + Number(value || 0), 0),
      revenue: summary?.paidRevenue || 0,
    };
  }, [summary, menus]);

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
        <StatCard label="MENU ITEMS" value={stats.menus} hint="Dishes across all restaurants" accent />
        <StatCard label="PAID REVENUE" value={formatCurrency(stats.revenue)} hint="From paid orders" />
      </div>

      <div className="adminOverviewGrid">
        <AdminNavCard
          to="/admin/owners"
          icon={<LuUserCheck size={28} />}
          title="Owners"
          subtitle={`${owners.length} restaurant owners`}
        >
          {owners.slice(0, 4).map((owner) => (
            <div key={owner.id} className="dashboardListRow">
              <div>
                <strong>{owner.name}</strong>
                <p>{owner.email}</p>
              </div>
              <span>{owner.restaurant_count} restaurant{owner.restaurant_count !== 1 ? "s" : ""}</span>
            </div>
          ))}
        </AdminNavCard>

        <AdminNavCard
          to="/admin/users"
          icon={<LuUsers size={28} />}
          title="Customers"
          subtitle={`${customers.length} registered customers`}
        >
          {customers.slice(0, 4).map((customer) => (
            <div key={customer.id} className="dashboardListRow">
              <div>
                <strong>{customer.name}</strong>
                <p>{customer.email}</p>
              </div>
              <span>{customer.order_count} order{customer.order_count !== 1 ? "s" : ""}</span>
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
              <span>{restaurant.menu_count} items</span>
            </div>
          ))}
        </AdminNavCard>

        <AdminNavCard
          to="/admin/menus"
          icon={<LuNotebookText size={28} />}
          title="Menus"
          subtitle={`${menus.length} menu items`}
        >
          {menus.slice(0, 4).map((item) => (
            <div key={item.id} className="dashboardListRow">
              <div>
                <strong>{item.name}</strong>
                <p>{item.restaurant_name}</p>
              </div>
              <span>{formatCurrency(item.price)}</span>
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
