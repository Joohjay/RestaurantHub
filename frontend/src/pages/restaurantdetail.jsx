import { Link, useParams } from "react-router-dom";
import "../App.css";

function RestaurantDetail({ restaurants, addToCart }) {
  const { id } = useParams();
  const restaurant = restaurants.find((item) => item.id === id);

  if (!restaurant) {
    return (
      <div className="page">
        <section className="pageHero">
          <h1>Restaurant not found</h1>
          <p>Please choose from our restaurant list instead.</p>
          <Link to="/restaurants">
            <button className="heroBtn">Back to Restaurants</button>
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="pageHero restaurantHero">
        <div>
          <h1>{restaurant.name}</h1>
          <p className="restaurantMeta">{restaurant.cuisine} • {restaurant.city}</p>
          <p className="restaurantRating">{restaurant.rating}</p>
        </div>
        <div className="restaurantEmoji">{restaurant.emoji}</div>
      </section>

      <section className="restaurantOverview">
        <p>{restaurant.description}</p>
        <div className="restaurantHighlights">
          {restaurant.highlights.map((highlight) => (
            <span key={highlight} className="highlightBadge">{highlight}</span>
          ))}
        </div>
      </section>

      <section className="restaurantInfoGrid">
        <div className="restaurantInfoCard">
          <h3>Location</h3>
          <p>{restaurant.location}</p>
          <p>{restaurant.address}</p>
          <p>{restaurant.phone}</p>
        </div>
        <div className="restaurantInfoCard">
          <h3>Order & Pickup</h3>
          <p>Choose a meal and schedule a pickup time for quick collection.</p>
          <Link to="/checkout">
            <button className="primaryBtn">Go to Cart</button>
          </Link>
        </div>
        <div className="restaurantInfoCard">
          <h3>Reserve a Table</h3>
          <p>Need a table? Reserve a spot now and add special requests.</p>
          <Link to="/reservation">
            <button className="secondaryBtn">Book a Table</button>
          </Link>
        </div>
      </section>

      <section className="menuSection">
        <h2>Menu</h2>
        <div className="menuGrid">
          {restaurant.menu.map((item) => (
            <div key={item.name} className="menuItem">
              <div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p>Tsh {item.price.toLocaleString()}</p>
              </div>
              <button className="heroBtn" onClick={() => addToCart(restaurant, item)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default RestaurantDetail;
