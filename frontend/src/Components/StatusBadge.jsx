const statusColors = {
  pending: "#FFA500",
  preparing: "#4169E1",
  ready: "#32CD32",
  delivered: "#228B22",
  completed: "#228B22",
  confirmed: "#4169E1",
  paid: "#228B22",
  unpaid: "#FF6347",
  failed: "#DC143C",
  refunded: "#808080",
  cancelled: "#DC143C",
  customer: "#4169E1",
  owner: "#7C3AED",
  admin: "#111827",
};

function StatusBadge({ value }) {
  const color = statusColors[value] || "#808080";

  return (
    <span className="statusBadge" style={{ backgroundColor: color }}>
      {value}
    </span>
  );
}

export default StatusBadge;
