import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LuArrowLeft, LuUtensilsCrossed, LuStar } from "react-icons/lu";
import ImageWithFallback from "../Components/ImageWithFallback";
import LoadingSpinner from "../Components/LoadingSpinner";
import { API_URL } from "../config";
import { formatRating } from "../utils/format";
import { resolveMenuImage } from "../utils/menuImages";
import "../App.css";

function formatPrice(price) {
  return Number(price).toLocaleString();
}

function imageUrl(image) {
  if (!image) return null;
  return `/images/${encodeURIComponent(image)}`;
}

function googleMapsUrl(latitude, longitude, fallbackLocation) {
  if (latitude && longitude) {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fallbackLocation)}`;
}

function RestaurantDetail({ addToCart }) {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRestaurant() {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`${API_URL}/api/restaurants/${id}`);
        if (response.status === 404) {
          setError("Restaurant not found.");
          return;
        }

        if (!response.ok) {
          setError("Failed to load restaurant.");
          return;
        }

        const data = await response.json();
        setRestaurant(data);
      } catch (err) {
        setError("Unable to load restaurant. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    const loadRestaurant = () => {
      fetchRestaurant();
    };

    queueMicrotask(loadRestaurant);
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <LoadingSpinner text="Loading restaurant..." />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="page">
        <section className="pageHero">
          <h1>{error || "Restaurant not found."}</h1>
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
        <div className="restaurantBreadcrumb">
          <Link to="/restaurants" className="breadcrumbLink">
            <LuArrowLeft size={24} />
          </Link>
        </div>
        <div>
          <h1>{restaurant.name}</h1>
          <p className="restaurantMeta">{restaurant.category} • {restaurant.location}</p>
          <p className="restaurantRating"><LuStar size={16} style={{ verticalAlign: "middle" }} /> {formatRating(restaurant.rating)}</p>
        </div>
        <div className="restaurantEmoji">
          <ImageWithFallback
            src={imageUrl(restaurant.image)}
            alt={restaurant.name}
            className="restaurantEmojiImg"
            placeholder={<LuUtensilsCrossed size={48} />}
          />
        </div>
      </section>

      <section className="restaurantOverview">
        <p>{restaurant.description}</p>
      </section>

      <div className="pageFlow">
        <span className="flowStep">Choose Restaurant</span>
        <span className="flowArrow">→</span>
        <span className="flowStep active">Select Menu Items</span>
        <span className="flowArrow">→</span>
        <span className="flowStep">Checkout</span>
        <span className="flowArrow">→</span>
        <span className="flowStep">Payment</span>
      </div>

      <section className="restaurantInfoGrid">
        <div className="restaurantInfoCard">
          <h3>Location</h3>
          <p>{restaurant.location}</p>
          {restaurant.latitude && restaurant.longitude && (
            <p>{Number(restaurant.latitude).toFixed(4)}, {Number(restaurant.longitude).toFixed(4)}</p>
          )}
          <a
            href={googleMapsUrl(restaurant.latitude, restaurant.longitude, restaurant.location)}
            target="_blank"
            rel="noreferrer"
          >
            <button className="secondaryBtn">Open in Google Maps</button>
          </a>
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
          <Link to={`/reservation?restaurant=${restaurant.id}`}>
            <button className="secondaryBtn">Book a Table</button>
          </Link>
        </div>
      </section>

      <section className="mapSection">
        <iframe
          title={`${restaurant.name} map`}
          src={`https://www.google.com/maps?q=${encodeURIComponent(
            restaurant.latitude && restaurant.longitude
              ? `${restaurant.latitude},${restaurant.longitude}`
              : restaurant.location
          )}&output=embed`}
          loading="lazy"
        />
      </section>

      <section className="menuSection">
        <h2>Menu</h2>
        {restaurant.menu?.length ? (
          <div className="menuGrid">
            {restaurant.menu.map((item) => (
              <div key={item.id} className="menuItem">
                <div className="menuItemInfo">
                  <ImageWithFallback
                    src={imageUrl(resolveMenuImage(item.name, item.image))}
                    alt={item.name}
                    className="menuItemImg"
                    placeholder={<div className="menuItemImgPlaceholder"><LuUtensilsCrossed size={24} /></div>}
                  />
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <p>Tsh {formatPrice(item.price)}</p>
                  </div>
                </div>
                <button
                  className="heroBtn"
                  disabled={item.available === false}
                  onClick={() => addToCart(restaurant, { ...item, price: Number(item.price) })}
                >
                  {item.available === false ? "Unavailable" : "Add to Cart"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No menu items found for this restaurant.</p>
        )}
      </section>
    </div>
  );
}

export default RestaurantDetail;
