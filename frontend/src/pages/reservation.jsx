import { useState } from "react";
import "../App.css";

function Reservation({ restaurants = [] }) {
  const [restaurantId, setRestaurantId] = useState(restaurants[0]?.id || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [requests, setRequests] = useState("");

  const selectedRestaurant = restaurants.find((restaurant) => restaurant.id === restaurantId);

  return (
    <div className="page authPage">
      <div className="authCard">
        <div className="authHeader">
          <h1>Reserve a Table</h1>
          <p>Choose your restaurant, date, and party size to book your table.</p>
        </div>
        <form className="authForm">
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
              <p>{selectedRestaurant.address}</p>
              <p>{selectedRestaurant.phone}</p>
            </div>
          )}

          <label>
            Date
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label>
            Time
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </label>
          <label>
            Number of guests
            <input type="number" value={guests} onChange={(e) => setGuests(e.target.value)} min="1" />
          </label>
          <label>
            Special requests
            <input value={requests} onChange={(e) => setRequests(e.target.value)} type="text" placeholder="Window seat, vegan meal, etc." />
          </label>
          <button type="submit" className="authButton">
            Confirm Reservation
          </button>
        </form>
      </div>
    </div>
  );
}

export default Reservation;
