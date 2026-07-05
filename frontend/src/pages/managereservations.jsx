import { useEffect, useState } from "react";
import PageFlow from "../Components/PageFlow";
import StatusBadge from "../Components/StatusBadge";
import { API_URL } from "../config";
import "../App.css";

const reservationStatuses = ["pending", "confirmed", "completed", "cancelled"];

function ManageReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  async function fetchReservations() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/reservations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setError("Failed to load reservations.");
        return;
      }

      const data = await response.json();
      setReservations(data);
    } catch (err) {
      setError("Unable to load reservations. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const loadReservations = () => {
      fetchReservations();
    };

    queueMicrotask(loadReservations);
  }, []);

  const updateReservationStatus = async (reservationId, status) => {
    try {
      setUpdatingId(reservationId);
      setError("");
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/reservations/${reservationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Failed to update reservation.");
        return;
      }

      setReservations((current) =>
        current.map((reservation) =>
          reservation.id === reservationId ? data : reservation
        )
      );
    } catch (err) {
      setError("Unable to update reservation. Please try again later.");
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div className="dashboardPage"><p>Loading reservations...</p></div>;

  return (
    <div className="dashboardPage">
      <div className="dashboardHeader">
        <div>
          <p className="dashboardLabel">Management</p>
          <h1>Manage Reservations</h1>
          <p className="dashboardSubcopy">Review, confirm, and manage all table bookings.</p>
        </div>
      </div>
      {error && <p className="authError">{error}</p>}

      <PageFlow
        steps={[
          { label: "Dashboard", to: "/owner" },
          { label: "Manage Restaurants", to: "/restaurants/manage" },
          { label: "Manage Menu", to: "/menu" },
          { label: "Manage Orders", to: "/orders" },
          { label: "Manage Reservations", active: true },
        ]}
      />

      {reservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        <div className="ordersTable">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Restaurant</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Time</th>
                <th>Guests</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>#{reservation.id}</td>
                  <td>{reservation.restaurant_name || reservation.restaurant_id}</td>
                  <td>{reservation.customer_name || reservation.customer_email || reservation.user_id}</td>
                  <td>{new Date(reservation.reservation_date).toLocaleDateString()}</td>
                  <td>{reservation.reservation_time}</td>
                  <td>{reservation.guests}</td>
                  <td>
                    <StatusBadge value={reservation.status} />
                  </td>
                  <td>
                    <select
                      value={reservation.status}
                      disabled={updatingId === reservation.id}
                      onChange={(event) => updateReservationStatus(reservation.id, event.target.value)}
                    >
                      {reservationStatuses.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageReservations;
