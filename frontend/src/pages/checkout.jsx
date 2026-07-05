import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuX, LuCalendarClock } from "react-icons/lu";
import { API_URL } from "../config";
import "../App.css";

function Checkout({ cartItems, removeFromCart, updateCartQuantity, clearCart }) {
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState("pickup");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [location, setLocation] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryLatitude, setDeliveryLatitude] = useState("");
  const [deliveryLongitude, setDeliveryLongitude] = useState("");
  const [dineInGuests, setDineInGuests] = useState(2);
  const [offerNote, setOfferNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const totals = useMemo(() => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { totalItems, totalPrice };
  }, [cartItems]);

  const handleGetCoordinates = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDeliveryLatitude(position.coords.latitude);
          setDeliveryLongitude(position.coords.longitude);
        },
        () => setError("Unable to retrieve location coordinates.")
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!contactName || !contactPhone || !pickupDate || !pickupTime) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (orderType === "delivery" && !deliveryAddress) {
      setError("Delivery address is required for delivery orders.");
      setLoading(false);
      return;
    }

    // Get first restaurant from cart items
    const restaurantId = cartItems[0]?.restaurantId;
    if (!restaurantId) {
      setError("No restaurant selected.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const items = cartItems.map((item) => ({
        id: item.menuItemId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          items,
          total_price: totals.totalPrice,
          is_delivery: orderType === "delivery",
          delivery_address: orderType === "delivery" ? deliveryAddress : null,
          delivery_latitude: orderType === "delivery" ? deliveryLatitude : null,
          delivery_longitude: orderType === "delivery" ? deliveryLongitude : null,
          scheduled_date: pickupDate || null,
          scheduled_time: pickupTime || null,
          payment_method: paymentMethod,
          status: "pending",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to create order.");
        setLoading(false);
        return;
      }

      const order = await response.json();
      clearCart();
      navigate(`/order-confirmation/${order.id}`);
    } catch (err) {
      setError("Unable to submit order. Please try again later.");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="page authPage">
      <div className="authCard checkoutCard">
        <div className="authHeader">
          <h1>Checkout & Order</h1>
          <p>Review your cart, add delivery details, and choose payment method.</p>
        </div>

        <div className="pageFlow compact">
          <span className="flowStep">Restaurant</span>
          <span className="flowArrow">→</span>
          <span className="flowStep">Menu</span>
          <span className="flowArrow">→</span>
          <span className="flowStep active">Checkout</span>
          <span className="flowArrow">→</span>
          <span className="flowStep">Payment</span>
        </div>

        <div className="checkoutContent">
          <section className="checkoutCart">
            <h2>Your Cart</h2>
            {cartItems.length === 0 ? (
              <div className="emptyCart">
                <p>Your cart is empty.</p>
                <Link to="/restaurants">
                  <button className="primaryBtn">Pick a Restaurant</button>
                </Link>
              </div>
            ) : (
              <>
                <div className="cartList">
                  {cartItems.map((item) => (
                    <div key={`${item.restaurantId}-${item.name}`} className="cartItem">
                      <div>
                        <strong>{item.name}</strong>
                        <p className="mutedText">{item.restaurantName}</p>
                        <p>Tsh {item.price.toLocaleString()} each</p>
                      </div>
                      <div className="cartActions">
                        <button
                          className="secondaryBtn"
                          type="button"
                          aria-label={`Decrease ${item.name} quantity`}
                          onClick={() => updateCartQuantity(item.restaurantId, item.name, -1)}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="secondaryBtn"
                          type="button"
                          aria-label={`Increase ${item.name} quantity`}
                          onClick={() => updateCartQuantity(item.restaurantId, item.name, 1)}
                        >
                          +
                        </button>
                        <button
                          className="iconButton"
                          type="button"
                          aria-label={`Remove ${item.name} from cart`}
                          onClick={() => removeFromCart(item.restaurantId, item.name)}
                        >
                          <LuX size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="secondaryBtn clearCartBtn" onClick={clearCart}>
                  Clear Cart
                </button>
              </>
            )}
          </section>

          <section className="checkoutFormSection">
            <form className="authForm" onSubmit={handleSubmitOrder}>
              <label>
                Order type
                <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                  <option value="pickup">Pickup</option>
                  <option value="delivery">Delivery</option>
                  <option value="dine-in">Dine-in</option>
                </select>
              </label>
              <label>
                Full name
                <input
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </label>
              <label>
                Phone number
                <input
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+255 7xx xxx xxx"
                  required
                />
              </label>
              {orderType === "delivery" && (
                <>
                  <label>
                    Delivery address
                    <input
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Delivery address"
                      required
                    />
                  </label>
                  <div className="coordinatesSection">
                    <p>Location coordinates (optional)</p>
                    <div className="coordinatesInputs">
                      <input
                        type="number"
                        step="0.00000001"
                        value={deliveryLatitude}
                        onChange={(e) => setDeliveryLatitude(e.target.value)}
                        placeholder="Latitude"
                      />
                      <input
                        type="number"
                        step="0.00000001"
                        value={deliveryLongitude}
                        onChange={(e) => setDeliveryLongitude(e.target.value)}
                        placeholder="Longitude"
                      />
                    </div>
                    <button
                      type="button"
                      className="secondaryBtn"
                      onClick={handleGetCoordinates}
                    >
                      Use My Location
                    </button>
                    {deliveryLatitude && deliveryLongitude && (
                      <div className="mapSection compactMap">
                        <iframe
                          title="Delivery location map"
                          src={`https://www.google.com/maps?q=${deliveryLatitude},${deliveryLongitude}&output=embed`}
                          loading="lazy"
                        />
                        <a
                          href={`https://www.google.com/maps?q=${deliveryLatitude},${deliveryLongitude}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <button type="button" className="secondaryBtn">Open Delivery Location</button>
                        </a>
                      </div>
                    )}
                  </div>
                </>
              )}
              {orderType === "dine-in" && (
                <label>
                  Number of guests
                  <input
                    type="number"
                    value={dineInGuests}
                    onChange={(e) => setDineInGuests(Number(e.target.value))}
                    min="1"
                  />
                </label>
              )}
              <div className="schedulingCard">
                <div className="schedulingCardHeader">
                  <LuCalendarClock size={22} />
                  <h3>
                    {orderType === "delivery"
                      ? "Schedule Delivery"
                      : orderType === "dine-in"
                      ? "Schedule Dine-in"
                      : "Schedule Pickup"}
                  </h3>
                </div>
                <p className="schedulingCardHint">
                  Choose when you would like your {orderType === "delivery" ? "order delivered" : orderType === "dine-in" ? "table ready" : "order ready for pickup"}.
                </p>
                <div className="schedulingInputs">
                  <label>
                    {orderType === "delivery"
                      ? "Delivery date"
                      : orderType === "dine-in"
                      ? "Dine-in date"
                      : "Pickup date"}
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      required
                    />
                  </label>
                  <label>
                    {orderType === "delivery"
                      ? "Delivery time"
                      : orderType === "dine-in"
                      ? "Dine-in time"
                      : "Pickup time"}
                    <input
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      required
                    />
                  </label>
                </div>
              </div>
              <label>
                Location notes
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter restaurant or pickup location"
                />
              </label>
              <label>
                Payment method
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <option value="cash">Cash on Delivery</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="card_future" disabled>Card (coming soon)</option>
                </select>
              </label>
              <label>
                Special requests
                <textarea
                  value={offerNote}
                  onChange={(e) => setOfferNote(e.target.value)}
                  placeholder="Add any special requests or notes"
                  rows="3"
                />
              </label>
              <div className="checkoutSummary">
                <div>
                  <strong>Total items</strong>
                  <p>{totals.totalItems}</p>
                </div>
                <div>
                  <strong>Estimate</strong>
                  <p>Tsh {totals.totalPrice.toLocaleString()}</p>
                </div>
              </div>
              {error && <p className="authError">{error}</p>}
              <button type="submit" className="authButton" disabled={loading}>
                {loading ? "Processing..." : "Place Order"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
