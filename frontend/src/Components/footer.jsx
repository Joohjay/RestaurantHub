import { Link } from "react-router-dom";
import { LuUtensilsCrossed, LuMail, LuPhone, LuMapPin } from "react-icons/lu";
import "../App.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="professionalFooter">
      <div className="footerContent">
        <div className="footerBrand">
          <h2><LuUtensilsCrossed size={24} style={{ verticalAlign: "middle", marginRight: 8 }} /> RestaurantHub</h2>
          <p>Browse · Order · Reserve · Pickup · Deliver</p>
          <p className="mutedText">Fresh food delivered fast. Discover top restaurants, reserve tables, and schedule pickups all in one place.</p>
        </div>

        <div className="footerLinksGroup">
          <h3>Quick Links</h3>
          <div className="footerLinks">
            <Link to="/">Home</Link>
            <Link to="/restaurants">Restaurants</Link>
            <Link to="/reservation">Reserve Table</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        <div className="footerLinksGroup">
          <h3>Account</h3>
          <div className="footerLinks">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/profile">Profile</Link>
          </div>
        </div>

        <div className="footerContact">
          <h3>Contact</h3>
          <p><LuMail size={16} style={{ verticalAlign: "middle" }} /> support@restauranthub.com</p>
          <p><LuPhone size={16} style={{ verticalAlign: "middle" }} /> +255 700 000 000</p>
          <p><LuMapPin size={16} style={{ verticalAlign: "middle" }} /> Dar es Salaam, Tanzania</p>
        </div>
      </div>

      <div className="footerBottom">
        <p>© {currentYear} RestaurantHub. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
