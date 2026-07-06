import { LuCheck, LuClock } from "react-icons/lu";

const statusSteps = [
  { key: "pending", label: "Order Placed" },
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready" },
  { key: "delivered", label: "Delivered" },
  { key: "completed", label: "Completed" },
];

function OrderTracker({ status }) {
  const normalizedStatus = status?.toLowerCase() || "pending";
  const cancelled = normalizedStatus === "cancelled";
  const currentIndex = cancelled ? -1 : statusSteps.findIndex((step) => step.key === normalizedStatus);

  return (
    <div className="orderTracker">
      {cancelled ? (
        <div className="orderTrackerCancelled">
          <span>This order has been cancelled.</span>
        </div>
      ) : (
        <div className="orderTrackerSteps">
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div
                key={step.key}
                className={`orderTrackerStep ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""}`}
              >
                <div className="orderTrackerDot">
                  {isCompleted ? <LuCheck size={14} /> : <LuClock size={14} />}
                </div>
                <span className="orderTrackerLabel">{step.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OrderTracker;
