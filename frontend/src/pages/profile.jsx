import { useEffect, useState } from "react";
import { LuLoader } from "react-icons/lu";
import { API_URL } from "../config";
import { isValidEmail, isValidPhone, normalizePhone } from "../utils/validation";
import "../App.css";

function Profile({ currentUser }) {
  const [profile, setProfile] = useState(currentUser || null);
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const token = localStorage.getItem("token");
        const [ordersResponse, reservationsResponse] = await Promise.all([
          fetch(`${API_URL}/api/orders`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/api/reservations`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (ordersResponse.ok) setOrders(await ordersResponse.json());
        if (reservationsResponse.ok) setReservations(await reservationsResponse.json());
      } catch (err) {
        console.error(err);
      }
    }

    fetchHistory();
  }, []);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((current) => ({ ...current, [name]: value }));
  };

  const updateProfile = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!profile.name.trim() || !profile.email.trim() || !profile.phone?.trim()) {
      setError("Name, email, and phone are required.");
      return;
    }

    if (!isValidEmail(profile.email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (!isValidPhone(profile.phone)) {
      setError("Enter a valid Tanzanian phone number.");
      return;
    }

    setProfileLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          phone: normalizePhone(profile.phone),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Failed to update profile.");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data));
      setProfile(data);
      setMessage("Profile updated.");
    } catch (err) {
      setError("Unable to update profile. Please try again later.");
      console.error(err);
    } finally {
      setProfileLoading(false);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setError("Current and new password are required.");
      return;
    }

    setPasswordLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/auth/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordForm),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Failed to change password.");
        return;
      }

      setPasswordForm({ currentPassword: "", newPassword: "" });
      setMessage("Password changed.");
    } catch (err) {
      setError("Unable to change password. Please try again later.");
      console.error(err);
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!profile) return <div className="dashboardPage"><p>Loading profile...</p></div>;

  return (
    <div className="dashboardPage">
      <div className="dashboardHeader">
        <div>
          <p className="dashboardLabel">Account</p>
          <h1>My Profile</h1>
          <p className="dashboardSubcopy">Manage your personal details, security, and order history.</p>
        </div>
      </div>
      {message && <p className="successMessage">{message}</p>}
      {error && <p className="authError">{error}</p>}

      <div className="profileGrid">
        <form className="authForm profileCard" onSubmit={updateProfile}>
          <h2>Profile Details</h2>
          <label>
            Name
            <input name="name" value={profile.name} onChange={handleProfileChange} required />
          </label>
          <label>
            Email
            <input name="email" type="email" value={profile.email} onChange={handleProfileChange} required />
          </label>
          <label>
            Phone
            <input name="phone" type="tel" value={profile.phone || ""} onChange={handleProfileChange} placeholder="0712345678" required />
          </label>
          <p>Role: {profile.role}</p>
          <button className="authButton" type="submit" disabled={profileLoading}>
            {profileLoading ? (
              <><LuLoader className="spin" size={18} /> Updating...</>
            ) : (
              "Update Profile"
            )}
          </button>
        </form>

        <form className="authForm profileCard" onSubmit={changePassword}>
          <h2>Change Password</h2>
          <label>
            Current password
            <input name="currentPassword" type="password" value={passwordForm.currentPassword} onChange={handlePasswordChange} required />
          </label>
          <label>
            New password
            <input name="newPassword" type="password" value={passwordForm.newPassword} onChange={handlePasswordChange} required />
          </label>
          <button className="authButton" type="submit" disabled={passwordLoading}>
            {passwordLoading ? (
              <><LuLoader className="spin" size={18} /> Changing...</>
            ) : (
              "Change Password"
            )}
          </button>
        </form>
      </div>

      <section className="historySection">
        <h2>Previous Orders</h2>
        {orders.length === 0 ? <p>No orders yet.</p> : orders.map((order) => (
          <div key={order.id} className="cartItem">
            <strong>Order #{order.id}</strong>
            <span>{order.status}</span>
            <span>Tsh {Number(order.total_price).toLocaleString()}</span>
          </div>
        ))}
      </section>

      <section className="historySection">
        <h2>Previous Reservations</h2>
        {reservations.length === 0 ? <p>No reservations yet.</p> : reservations.map((reservation) => (
          <div key={reservation.id} className="cartItem">
            <strong>Reservation #{reservation.id}</strong>
            <span>{new Date(reservation.reservation_date).toLocaleDateString()}</span>
            <span>{reservation.status}</span>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Profile;
