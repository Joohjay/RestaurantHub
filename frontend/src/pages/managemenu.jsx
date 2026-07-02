import "../App.css";

function ManageMenu() {
  return (
    <div className="page">
      <h1>Manage Menu</h1>
      <div className="menuGrid">
        <div className="menuItem">
          <h2>Margherita Pizza</h2>
          <p>Price: Tsh 18,000</p>
          <button>Edit</button>
        </div>
        <div className="menuItem">
          <h2>Cheeseburger</h2>
          <p>Price: Tsh 12,000</p>
          <button>Edit</button>
        </div>
        <div className="menuItem">
          <h2>Caesar Salad</h2>
          <p>Price: Tsh 10,000</p>
          <button>Edit</button>
        </div>
      </div>
    </div>
  );
}

export default ManageMenu;
