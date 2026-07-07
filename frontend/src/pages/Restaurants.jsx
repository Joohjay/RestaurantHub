import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { LuUtensilsCrossed, LuStar } from "react-icons/lu";
import ImageWithFallback from "../Components/ImageWithFallback";
import LoadingSpinner from "../Components/LoadingSpinner";
import { API_URL } from "../config";
import { formatRating } from "../utils/format";
import "../App.css";

function restaurantImageUrl(image) {
  if (!image) return null;
  return `/images/${encodeURIComponent(image)}`;
}

function Restaurants() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [sort, setSort] = useState("rating");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (category) params.category = category;
    if (location) params.location = location;
    setSearchParams(params, { replace: true });
  }, [search, category, location, setSearchParams]);

  const categories = [...new Set(restaurants.map((restaurant) => restaurant.category).filter(Boolean))];
  const locations = [...new Set(restaurants.map((restaurant) => restaurant.location).filter(Boolean))];
  const filteredRestaurants = restaurants
    .filter((restaurant) =>
      restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
      restaurant.description?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((restaurant) => !category || restaurant.category === category)
    .filter((restaurant) => !location || restaurant.location === location)
    .sort((left, right) => {
      if (sort === "name") return left.name.localeCompare(right.name);
      return Number(right.rating || 0) - Number(left.rating || 0);
    });

  return (
    <div className="page restaurantsPage">
      <section className="pageHero restaurantsHero">
        <h1>Restaurants</h1>
        <p>Discover restaurants from different locations and enjoy your favorite meals.</p>
      </section>

      <section className="filterBar">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search restaurants..."
        />
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">All categories</option>
          {categories.map((entry) => (
            <option key={entry} value={entry}>{entry}</option>
          ))}
        </select>
        <select value={location} onChange={(event) => setLocation(event.target.value)}>
          <option value="">All locations</option>
          {locations.map((entry) => (
            <option key={entry} value={entry}>{entry}</option>
          ))}
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="rating">Sort by rating</option>
          <option value="name">Sort by name</option>
        </select>
      </section>

      {loading && <LoadingSpinner text="Loading restaurants..." />}
      {error && <p className="authError">{error}</p>}

      {!loading && !error && filteredRestaurants.length === 0 && (
        <p>No restaurants found.</p>
      )}

      {!loading && !error && filteredRestaurants.length > 0 && (
        <section className="restaurantGrid">
          {filteredRestaurants.map((restaurant) => (
            <div key={restaurant.id} className="restaurantCard">
              <Link to={`/restaurant/${restaurant.id}`} className="restaurantCardLink">
                <div className="restaurantImage">
                  <ImageWithFallback
                    src={restaurantImageUrl(restaurant.image)}
                    alt={restaurant.name}
                    placeholder={<LuUtensilsCrossed size={40} />}
                  />
                </div>
                <h2>{restaurant.name}</h2>
                <p className="restaurantMeta">{restaurant.category} • {restaurant.location}</p>
                <p className="restaurantRating"><LuStar size={14} style={{ verticalAlign: "middle" }} /> {formatRating(restaurant.rating)}</p>
                <p className="restaurantDescription">{restaurant.description}</p>
              </Link>
              <div className="cardActions">
                <Link to={`/restaurant/${restaurant.id}`}>
                  <button className="heroBtn">View Restaurant</button>
                </Link>
                <Link to={`/reservation?restaurant=${restaurant.id}`}>
                  <button className="secondaryBtn">Reserve Table</button>
                </Link>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export default Restaurants;
