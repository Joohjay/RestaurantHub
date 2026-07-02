import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Checkout({ cartItems, removeFromCart, updateCartQuantity, clearCart }) {
  const [orderType, setOrderType] = useState("pickup");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [location, setLocation] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [dineInGuests, setDineInGuests] = useState(2);
  const [offerNote, setOfferNote] = useState("");

  const totals = useMemo(() => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { totalItems, totalPrice };
  }, [cartItems]);

  return (
    <div className="page authPage">
      <div className="authCard checkoutCard">
        <div className="authHeader">
          <h1>Pickup & Order</h1>
          <p>Review your cart, schedule pickup, and submit your order offer.</p>
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
                        <button className="secondaryBtn" onClick={() => updateCartQuantity(item.restaurantId, item.name, -1)}>
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button className="secondaryBtn" onClick={() => updateCartQuantity(item.restaurantId, item.name, 1)}>
                          +
                        </button>
                        <button className="iconButton" onClick={() => removeFromCart(item.restaurantId, item.name)}>
                          ✕
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
            <form className="authForm">
              <label>
                Order type
                <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                  <option value="delivery">Delivery</option>
                  <option value="dine-in">Dine-in</option>
                  <option value="pickup">Pickup</option>
                </select>
              </label>
              <label>
                Full name
                <input value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Your name" />
              </label>
              <label>
                Phone number
                <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+255 7xx xxx xxx" />
              </label>
              {orderType === "delivery" ? (
                <label>
                  Delivery address
                  <input value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="Delivery address" />
                </label>
              ) : null}
              {orderType === "dine-in" ? (
                <label>
                  Number of guests
                  <input type="number" value={dineInGuests} onChange={(e) => setDineInGuests(Number(e.target.value))} min="1" />
                </label>
              ) : null}
              <label>
                {orderType === "delivery" ? "Delivery date" : orderType === "dine-in" ? "Reservation date" : "Pickup date"}
                <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} />
              </label>
              <label>
                {orderType === "delivery" ? "Delivery time" : orderType === "dine-in" ? "Reservation time" : "Pickup time"}
                <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} />
              </label>
              <label>
                Location notes
                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter restaurant or pickup location" />
              </label>
              <label>
                Offer note
                <textarea value={offerNote} onChange={(e) => setOfferNote(e.target.value)} placeholder="Add any special offer notes or requests" rows="4" />
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
              <button type="button" className="authButton">
                Submit Order Offer
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
