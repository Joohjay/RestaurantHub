import { Link } from "react-router-dom";

function AdminPageHeader({ label, title, subtitle, backTo, backLabel = "Back to Dashboard" }) {
  return (
    <div className="dashboardHeader">
      <div>
        <p className="dashboardLabel">{label}</p>
        <h1>{title}</h1>
        <p className="dashboardSubcopy">{subtitle}</p>
      </div>
      {backTo && (
        <div className="dashboardActions">
          <Link to={backTo}>
            <button className="secondaryBtn">{backLabel}</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default AdminPageHeader;
