import { Link } from "react-router-dom";

function PageFlow({ steps, compact = false }) {
  return (
    <div className={`pageFlow ${compact ? "compact" : ""}`}>
      {steps.map((step, index) => (
        <span className="flowGroup" key={`${step.label}-${index}`}>
          {index > 0 && <span className="flowArrow">&gt;</span>}
          {step.to ? (
            <Link to={step.to} className={`flowStep ${step.active ? "active" : ""}`}>
              {step.label}
            </Link>
          ) : (
            <span className={`flowStep ${step.active ? "active" : ""}`}>
              {step.label}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

export default PageFlow;
