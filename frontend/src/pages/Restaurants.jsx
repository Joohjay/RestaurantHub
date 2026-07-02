import "../App.css";
import { Link } from "react-router-dom";

function Restaurants({ restaurants }) {
  return (
    <div className="page">
      <section className="pageHero">
        <h1>Restaurants</h1>
        <p>Discover restaurants from different locations and enjoy your favorite meals.</p>
      </section>

      <section className="restaurantGrid">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="restaurantCard">
            <div className="restaurantImage">{restaurant.emoji}</div>
            <h2>{restaurant.name}</h2>
            <p className="restaurantMeta">{restaurant.cuisine} • {restaurant.city}</p>
            <p className="restaurantRating">{restaurant.rating}</p>
            <p className="restaurantDescription">{restaurant.description}</p>
            <Link to={`/restaurant/${restaurant.id}`}>
              <button className="heroBtn">View Restaurant</button>
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Restaurants;
