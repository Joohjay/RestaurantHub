import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API_URL } from "../config";
import "../App.css";

function Reservation() {
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get("restaurant");
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantId, setRestaurantId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [requests, setRequests] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedRestaurant = restaurants.find((restaurant) => String(restaurant.id) === String(restaurantId));

  const fetchRestaurants = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/restaurants`);
      if (!response.ok) {
        setError("Failed to load restaurants.");
        return;
      }

      const data = await response.json();
      setRestaurants(data);
      const initialId =
        preselectedId && data.some((restaurant) => String(restaurant.id) === String(preselectedId))
          ? preselectedId
          : data[0]?.id || "";
      setRestaurantId(initialId);
    } catch (err) {
      setError("Unable to load restaurants. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [preselectedId]);

  useEffect(() => {
    const loadRestaurants = () => {
      fetchRestaurants();
    };

    queueMicrotask(loadRestaurants);
  }, [fetchRestaurants]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          reservation_date: date,
          reservation_time: time,
          guests: Number(guests),
          requests,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Failed to create reservation.");
        return;
      }

      setSuccess("Reservation created successfully.");
      setDate("");
      setTime("");
      setGuests(2);
      setRequests("");
    } catch (err) {
      setError("Unable to create reservation. Please try again later.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page authPage">
      <div className="authCard">
        <div className="authHeader">
          <h1>Reserve a Table</h1>
          <p>Choose your restaurant, date, and party size to book your table.</p>
        </div>
        <div className="pageFlow compact">
          <span className="flowStep">Choose Restaurant</span>
          <span className="flowArrow">→</span>
          <span className="flowStep active">Reservation Details</span>
          <span className="flowArrow">→</span>
          <span className="flowStep">Confirm Booking</span>
        </div>

        {loading && <p>Loading restaurants...</p>}
        {error && <p className="authError">{error}</p>}

        {!loading && !error && (
          <form className="authForm" onSubmit={handleSubmit}>
            <label>
              Restaurant
              <select value={restaurantId} onChange={(e) => setRestaurantId(e.target.value)}>
                {restaurants.map((restaurant) => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.name} • {restaurant.location}
                  </option>
                ))}
              </select>
            </label>

            {selectedRestaurant && (
              <div className="restaurantDetailsCard">
                <h3>{selectedRestaurant.name}</h3>
                <p>{selectedRestaurant.category}</p>
                <p>{selectedRestaurant.location}</p>
              </div>
            )}

            <label>
              Date
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </label>
            <label>
              Time
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </label>
            <label>
              Number of guests
              <input type="number" value={guests} onChange={(e) => setGuests(e.target.value)} min="1" required />
            </label>
            <label>
              Special requests
              <input value={requests} onChange={(e) => setRequests(e.target.value)} type="text" placeholder="Window seat, vegan meal, etc." />
            </label>
            {success && <p className="successMessage">{success}</p>}
            <button type="submit" className="authButton" disabled={submitting}>
              {submitting ? "Reserving..." : "Confirm Reservation"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Reservation;
