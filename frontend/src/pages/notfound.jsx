import { Link } from "react-router-dom";
import { LuHouse, LuSearch } from "react-icons/lu";
import "../App.css";

function NotFound() {
  return (
    <div className="page notFoundPage">
      <div className="notFoundContent">
        <h1>404</h1>
        <h2>Page not found</h2>
        <p>
          The page you are looking for does not exist or has been moved. Check the URL or explore the restaurants below.
        </p>
        <div className="notFoundActions">
          <Link to="/">
            <button className="primaryBtn">
              <LuHouse size={18} style={{ verticalAlign: "middle", marginRight: 8 }} />
              Go Home
            </button>
          </Link>
          <Link to="/restaurants">
            <button className="secondaryBtn">
              <LuSearch size={18} style={{ verticalAlign: "middle", marginRight: 8 }} />
              Browse Restaurants
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
