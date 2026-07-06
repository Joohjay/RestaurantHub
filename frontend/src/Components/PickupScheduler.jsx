import { LuCalendarClock } from "react-icons/lu";

const orderTypeLabels = {
  pickup: { title: "Schedule Pickup", date: "Pickup date", time: "Pickup time", hint: "order ready for pickup" },
  delivery: { title: "Schedule Delivery", date: "Delivery date", time: "Delivery time", hint: "order delivered" },
  "dine-in": { title: "Schedule Dine-in", date: "Dine-in date", time: "Dine-in time", hint: "table ready" },
};

function PickupScheduler({ orderType = "pickup", date, time, onDateChange, onTimeChange, required = true }) {
  const labels = orderTypeLabels[orderType] || orderTypeLabels.pickup;

  return (
    <div className="schedulingCard">
      <div className="schedulingCardHeader">
        <LuCalendarClock size={22} />
        <h3>{labels.title}</h3>
      </div>
      <p className="schedulingCardHint">
        Choose when you would like your {labels.hint}.
      </p>
      <div className="schedulingInputs">
        <label>
          {labels.date}
          <input
            type="date"
            value={date}
            onChange={(event) => onDateChange(event.target.value)}
            required={required}
          />
        </label>
        <label>
          {labels.time}
          <input
            type="time"
            value={time}
            onChange={(event) => onTimeChange(event.target.value)}
            required={required}
          />
        </label>
      </div>
    </div>
  );
}

export default PickupScheduler;
