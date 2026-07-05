function StatCard({ label, value, hint, accent }) {
  return (
    <div className={`statusCard ${accent ? "statusCardAccent" : ""}`}>
      <p>{label}</p>
      <h2>{value}</h2>
      <span>{hint}</span>
    </div>
  );
}

export default StatCard;
