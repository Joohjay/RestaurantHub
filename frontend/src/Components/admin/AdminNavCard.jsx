import { Link } from "react-router-dom";
import { LuArrowRight } from "react-icons/lu";

function AdminNavCard({ to, icon, title, subtitle, children }) {
  return (
    <Link to={to} className="overviewCard adminNavCard">
      <div className="overviewCardHeader">
        <div className="adminNavCardHeader">
          {icon}
          <h2>{title}</h2>
        </div>
        <span className="adminNavArrow"><LuArrowRight size={20} /></span>
      </div>
      <p className="adminNavSub">{subtitle}</p>
      <div className="adminNavPreview">
        {children}
      </div>
    </Link>
  );
}

export default AdminNavCard;
