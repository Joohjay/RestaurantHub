import "../App.css";

function Admin() {
  return (
    <div className="page">
      <h1>Admin Dashboard</h1>
      <div className="stats">
        <div>
          <h1>120</h1>
          <p>Restaurants</p>
        </div>
        <div>
          <h1>8300</h1>
          <p>Users</p>
        </div>
        <div>
          <h1>15200</h1>
          <p>Orders</p>
        </div>
      </div>
    </div>
  );
}

export default Admin;