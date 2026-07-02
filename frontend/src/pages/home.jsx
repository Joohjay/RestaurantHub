import "../App.css";
import { Link } from "react-router-dom";

const categories = [
  { emoji: "🍕", title: "Pizza" },
  { emoji: "🍔", title: "Fast Food" },
  { emoji: "🥗", title: "Healthy Meals" },
  { emoji: "🍜", title: "Local Cuisine" },
  { emoji: "☕", title: "Cafes" },
  { emoji: "🍰", title: "Desserts" },
];

const popularRestaurants = [
  { id: "pizza-palace", emoji: "🍕", name: "Pizza Palace", rating: "★★★★★", location: "Mbeya" },
  { id: "burger-house", emoji: "🍔", name: "Burger House", rating: "★★★★★", location: "Dar es Salaam" },
  { id: "coffee-corner", emoji: "☕", name: "Coffee Corner", rating: "★★★★☆", location: "Mwanza" },
];

const features = [
  { icon: "🔍", title: "Browse Restaurants", description: "Find top-rated restaurants near you." },
  { icon: "🪑", title: "Table Reservation", description: "Reserve tables with one click." },
  { icon: "⏱️", title: "Pickup Scheduling", description: "Plan your order pickup time." },
  { icon: "🚚", title: "Delivery Location", description: "Fast restaurant delivery to your door." },
  { icon: "🔒", title: "Secure Payments", description: "Pay safely with multiple options." },
];

function Home() {
  return (
    <>
      <section className="hero heroWithMedia">
        <div className="heroContent">
          <div className="heroBadge">Fresh food delivered fast</div>
          <h1>It’s not just food, it’s an experience.</h1>
          <p>
            We help you get fresh and delicious meals in minutes with an easy web and mobile ordering experience.
          </p>
          <div className="heroCtas">
            <Link to="/restaurants">
              <button className="primaryBtn">View Menu</button>
            </Link>
            <Link to="/register">
              <button className="secondaryBtn">Sign Up</button>
            </Link>
          </div>
          <div className="heroStats">
            <div>
              <strong>120+</strong>
              <span>Restaurants</span>
            </div>
            <div>
              <strong>8K+</strong>
              <span>Orders</span>
            </div>
            <div>
              <strong>4.9</strong>
              <span>Rating</span>
            </div>
          </div>
        </div>
        <div className="heroMedia">
          <div className="phoneMockup">
            <div className="phoneScreen">
              <div className="menuTag">Chicken Burger</div>
              <div className="menuPrice">$15.00</div>
              <div className="menuDetails">Fresh ingredients and premium toppings.</div>
              <button className="primaryBtn fullWidth">Add to Cart</button>
            </div>
          </div>
        </div>
      </section>

      <section className="search" id="search">
        <h2>Find Restaurants</h2>
        <div className="searchBox">
          <input placeholder="Search restaurant..." />
          <select>
            <option>Location</option>
            <option>Mbeya</option>
            <option>Dar</option>
            <option>Arusha</option>
          </select>
          <button>Search</button>
        </div>
      </section>

      <section className="categories">
        <h2>Browse by Category</h2>
        <div className="categoryGrid">
          {categories.map((category) => (
            <div key={category.title} className="categoryCard">
              <span>{category.emoji}</span>
              <h3>{category.title}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="restaurants">
        <h2>Popular Restaurants</h2>
        <div className="cards">
          {popularRestaurants.map((restaurant) => (
            <div key={restaurant.id} className="card">
              <span>{restaurant.emoji}</span>
              <h3>{restaurant.name}</h3>
              <p>{restaurant.rating}</p>
              <p>{restaurant.location}</p>
              <Link to={`/restaurant/${restaurant.id}`}>
                <button>Order Now</button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="featured">
        <h2>Featured Restaurant</h2>
        <div className="featuredBox">
          <div className="featuredImage">🍽️</div>
          <div className="featuredInfo">
            <h3>Ocean View Restaurant</h3>
            <p>
              Experience fresh seafood, local dishes, and international cuisine in a relaxing atmosphere with fast delivery and table reservations.
            </p>
            <Link to="/restaurants">
              <button className="heroBtn">View Menu</button>
            </Link>
          </div>
        </div>
      </section>

      <section className="why">
        <h2>Why Choose RestaurantHub?</h2>
        <div className="features">
          {features.map((feature) => (
            <div key={feature.title} className="featureCard">
              <span>{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="stats">
        <div>
          <h1>120+</h1>
          <p>Restaurants</p>
        </div>
        <div>
          <h1>8K+</h1>
          <p>Orders</p>
        </div>
        <div>
          <h1>4.9</h1>
          <p>Rating</p>
        </div>
      </section>

      <section className="reviews">
        <h2>Customer Reviews</h2>
        <div className="reviewContainer">
          <div className="reviewCard">
            <p>★★★★★</p>
            <p>Ordering food from different restaurants has never been easier.</p>
            <h4>- Sarah</h4>
          </div>
          <div className="reviewCard">
            <p>★★★★★</p>
            <p>The reservation feature saves me a lot of time.</p>
            <h4>- Michael</h4>
          </div>
          <div className="reviewCard">
            <p>★★★★★</p>
            <p>The platform is simple, fast and easy to use.</p>
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
