import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuSearch, LuUtensilsCrossed, LuClock, LuTruck, LuLock, LuStar, LuCoffee } from "react-icons/lu";
import ImageWithFallback from "../Components/ImageWithFallback";
import { API_URL } from "../config";
import "../App.css";

const categoryIcons = {
  "Local Cuisine": <LuUtensilsCrossed size={32} />,
  Pizza: <LuUtensilsCrossed size={32} />,
  "Fast Food": <LuUtensilsCrossed size={32} />,
  Seafood: <LuUtensilsCrossed size={32} />,
  Café: <LuCoffee size={32} />,
  "Healthy Meals": <LuUtensilsCrossed size={32} />,
  Chicken: <LuUtensilsCrossed size={32} />,
  Desserts: <LuUtensilsCrossed size={32} />,
};

const features = [
  { icon: <LuSearch size={28} />, title: "Browse Restaurants", description: "Find top-rated restaurants near you." },
  { icon: <LuUtensilsCrossed size={28} />, title: "Table Reservation", description: "Reserve tables with one click." },
  { icon: <LuClock size={28} />, title: "Pickup Scheduling", description: "Plan your order pickup time." },
  { icon: <LuTruck size={28} />, title: "Delivery Location", description: "Fast restaurant delivery to your door." },
  { icon: <LuLock size={28} />, title: "Secure Payments", description: "Pay safely with multiple options." },
];

function formatRating(rating) {
  return rating ? `${Number(rating).toFixed(1)}` : "Not rated";
}

function imageUrl(image) {
  if (!image) return null;
  return `/images/${encodeURIComponent(image)}`;
}

const restaurantBackgrounds = {
  "Coffee Corner": "coffee (2).jpg",
  "Green Bowl": "quinoa bowl inspo.jpg",
  "Kilimanjaro Pizza": "chicken pizza.jpg",
  "Nyumbani Grill": "grilled meat.jpg",
  "Safari Chicken House": "fried chicken pieces.jpg",
  "Spice Coast Seafood": "garlic butter fish.jpg",
  "Sweet Treats Bakery": "baked cakes.jpg",
  "Urban Burger": "burger and fries.jpg",
};

const categoryBackgrounds = {
  "Local Cuisine": "grilled meat.jpg",
  "Pizza": "chicken pizza.jpg",
  "Fast Food": "burger and fries.jpg",
  "Seafood": "garlic butter fish.jpg",
  "Café": "coffee (2).jpg",
  "Healthy Meals": "quinoa bowl inspo.jpg",
  "Chicken": "fried chicken pieces.jpg",
  "Desserts": "baked cakes.jpg",
};

function getRestaurantBackground(name) {
  return restaurantBackgrounds[name] || "hero-bg.jpg";
}

function getCategoryBackground(name) {
  return categoryBackgrounds[name] || "hero-bg.jpg";
}

function Home() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [homeSearch, setHomeSearch] = useState("");
  const [homeLocation, setHomeLocation] = useState("");

  async function fetchRestaurants() {
    try {
      const response = await fetch(`${API_URL}/api/restaurants`);
      if (!response.ok) {
        setError("Failed to load restaurants.");
        return;
      }

      const data = await response.json();
      setRestaurants(data);
    } catch (err) {
      setError("Unable to load restaurants. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const loadRestaurants = () => {
      fetchRestaurants();
    };

    queueMicrotask(loadRestaurants);
  }, []);

  const popularRestaurants = useMemo(
    () =>
      [...restaurants]
        .sort((left, right) => Number(right.rating || 0) - Number(left.rating || 0))
        .slice(0, 3),
    [restaurants]
  );

  const categories = useMemo(
    () =>
      [...new Set(restaurants.map((restaurant) => restaurant.category).filter(Boolean))].map((category) => ({
        icon: categoryIcons[category] || <LuUtensilsCrossed size={32} />,
        title: category,
      })),
    [restaurants]
  );

  const locations = useMemo(
    () => [...new Set(restaurants.map((restaurant) => restaurant.location).filter(Boolean))],
    [restaurants]
  );

  const topRatedRestaurant = popularRestaurants[0];
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featuredRestaurant =
    restaurants.length > 0
      ? restaurants[featuredIndex % restaurants.length]
      : topRatedRestaurant;
  const featuredBackground = featuredRestaurant
    ? getRestaurantBackground(featuredRestaurant.name)
    : "hero-bg.jpg";
  const phoneBackground = featuredRestaurant
    ? getRestaurantBackground(featuredRestaurant.name)
    : "restaurant-ocean-catch.jpg";

  useEffect(() => {
    if (restaurants.length === 0) return;
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % restaurants.length);
    }, 30000);
    return () => clearInterval(interval);
  }, [restaurants]);

  return (
    <>
      <section
        className="hero heroWithMedia"
        style={{
          backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.78), rgba(15, 23, 42, 0.88)), url('/images/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="heroContent">
          <div className="heroBadge">Fresh food delivered fast</div>
          <h1>It’s not just food, it’s an experience.</h1>
          <p>
            We help you get fresh and delicious meals in minutes with an easy web and mobile ordering experience.
          </p>
          <div className="heroCtas">
            <Link to="/restaurants">
              <button className="primaryBtn">Explore Restaurants</button>
            </Link>
            <Link to="/register">
              <button className="secondaryBtn">Sign Up</button>
            </Link>
          </div>
          <div className="heroStats">
            <div>
              <strong>{restaurants.length || 0}</strong>
              <span>Restaurants</span>
            </div>
            <div>
              <strong>{categories.length || 0}</strong>
              <span>Categories</span>
            </div>
            <div>
              <strong>{topRatedRestaurant ? Number(topRatedRestaurant.rating).toFixed(1) : "0.0"}</strong>
              <span>Top Rating</span>
            </div>
          </div>
        </div>
        <div className="heroMedia">
          <div className="phoneMockup">
            <div
              key={featuredIndex}
              className="phoneScreen phoneContentAnimate"
              style={{
                backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.82), rgba(15, 23, 42, 0.88)), url('/images/${encodeURIComponent(phoneBackground)}')`,
              }}
            >
              <div className="menuTag">{featuredRestaurant?.name || "DineHub"}</div>
              <div className="menuPrice">{featuredRestaurant ? <>{formatRating(featuredRestaurant.rating)}</> : "Fresh meals"}</div>
              <div className="menuDetails">{featuredRestaurant?.description || "Explore restaurants and order your favorite meals."}</div>
              <Link to={featuredRestaurant ? `/restaurant/${featuredRestaurant.id}` : "/restaurants"}>
                <button className="primaryBtn fullWidth">View Menu</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="search" id="search">
        <h2>Find Restaurants</h2>
        <div className="searchBox">
          <input
            placeholder="Search restaurant..."
            value={homeSearch}
            onChange={(event) => setHomeSearch(event.target.value)}
          />
          <select
            value={homeLocation}
            onChange={(event) => setHomeLocation(event.target.value)}
          >
            <option value="">Location</option>
            {locations.map((location) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
          <button
            onClick={() => {
              const params = new URLSearchParams();
              if (homeSearch.trim()) params.set("search", homeSearch.trim());
              if (homeLocation) params.set("location", homeLocation);
              navigate(`/restaurants?${params.toString()}`);
            }}
          >
            Search
          </button>
        </div>
      </section>

      {loading && <section className="restaurants"><p>Loading restaurants...</p></section>}
      {error && <section className="restaurants"><p className="authError">{error}</p></section>}

      {!loading && !error && (
        <>
          <section className="categories">
            <h2>Browse by Category</h2>
            <div className="categoryGrid">
              {categories.map((category) => (
                <Link
                  key={category.title}
                  to={`/restaurants?category=${encodeURIComponent(category.title)}`}
                  className="categoryCard"
                  style={{
                    backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.86)), url('/images/${encodeURIComponent(getCategoryBackground(category.title))}')`,
                  }}
                >
                  <span className="categoryIcon">{category.icon}</span>
                  <h3>{category.title}</h3>
                </Link>
              ))}
            </div>
          </section>

          <section className="restaurants">
            <h2>Popular Restaurants</h2>
            <div className="cards">
              {popularRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="card">
                  <span className="cardIcon">
                    <ImageWithFallback
                      src={imageUrl(restaurant.image)}
                      alt={restaurant.name}
                      className="cardRestaurantImg"
                      placeholder={<LuUtensilsCrossed size={32} />}
                    />
                  </span>
                  <h3>{restaurant.name}</h3>
                  <p><LuStar size={14} style={{ verticalAlign: "middle" }} /> {formatRating(restaurant.rating)}</p>
                  <p>{restaurant.location}</p>
                  <Link to={`/restaurant/${restaurant.id}`}>
                    <button>Order Now</button>
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {featuredRestaurant && (
            <section className="featured">
              <h2>Featured Restaurant</h2>
              <div
                key={featuredIndex}
                className="featuredBox featuredAnimate"
                style={{
                  backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.92)), url('/images/${encodeURIComponent(featuredBackground)}')`,
                }}
              >
                <div className="featuredImage">
                  <ImageWithFallback
                    src={imageUrl(featuredRestaurant.image)}
                    alt={featuredRestaurant.name}
                    className="featuredRestaurantImg featuredImageAnimate"
                    placeholder={<LuUtensilsCrossed size={48} />}
                  />
                </div>
                <div className="featuredInfo">
                  <h3>{featuredRestaurant.name}</h3>
                  <p>{featuredRestaurant.description}</p>
                  <Link to={`/restaurant/${featuredRestaurant.id}`}>
                    <button className="heroBtn">View Menu</button>
                  </Link>
                </div>
              </div>
              <div className="featuredDots">
                {restaurants.map((restaurant, index) => (
                  <button
                    key={restaurant.id}
                    className={`featuredDot ${index === featuredIndex % restaurants.length ? "active" : ""}`}
                    onClick={() => setFeaturedIndex(index)}
                    aria-label={`Show ${restaurant.name}`}
                    type="button"
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <section className="why">
        <h2>Why Choose DineHub?</h2>
        <div className="features">
          {features.map((feature) => (
            <div key={feature.title} className="featureCard">
              <span className="featureIcon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="stats">
        <div>
          <h1>{restaurants.length || 0}</h1>
          <p>Restaurants</p>
        </div>
        <div>
          <h1>{categories.length || 0}</h1>
          <p>Categories</p>
        </div>
        <div>
          <h1>{topRatedRestaurant ? Number(topRatedRestaurant.rating).toFixed(1) : "0.0"}</h1>
          <p>Top Rating</p>
        </div>
      </section>

      <section className="reviews">
        <h2>Customer Reviews</h2>
        <div className="reviewContainer">
          <div className="reviewCard">
            <p className="reviewStars"><LuStar size={16} /><LuStar size={16} /><LuStar size={16} /><LuStar size={16} /><LuStar size={16} /></p>
            <p>Ordering local meals was quick and easy.</p>
            <h4>- Sarah</h4>
          </div>
          <div className="reviewCard">
            <p className="reviewStars"><LuStar size={16} /><LuStar size={16} /><LuStar size={16} /><LuStar size={16} /><LuStar size={16} /></p>
            <p>The reservation feature saves me a lot of time.</p>
            <h4>- Michael</h4>
          </div>
          <div className="reviewCard">
            <p className="reviewStars"><LuStar size={16} /><LuStar size={16} /><LuStar size={16} /><LuStar size={16} /><LuStar size={16} /></p>
            <p>The restaurant selection feels fresh and simple to browse.</p>
            <h4>- James</h4>
          </div>
        </div>
      </section>

      <section className="faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faqItem">
          <h3>How do I order food?</h3>
          <p>Choose a restaurant, select your meals and place your order online.</p>
        </div>
        <div className="faqItem">
          <h3>Can I reserve a table?</h3>
          <p>Yes. Select a restaurant and choose your preferred reservation time.</p>
        </div>
        <div className="faqItem">
          <h3>Do you support pickup?</h3>
          <p>Yes. You can schedule pickup from participating restaurants.</p>
        </div>
      </section>
    </>
  );
}

export default Home;
