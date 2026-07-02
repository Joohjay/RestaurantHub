import "../App.css";

function Dashboard() {
  return (
    <div className="dashboardPage">
      <div className="dashboardHeader">
        <div>
          <p className="dashboardLabel">Dashboard Overview</p>
          <h1>Welcome back, here’s what’s happening today.</h1>
        </div>
        <div className="dashboardActions">
          <button className="secondaryBtn">Monthly</button>
          <button className="primaryBtn">Generate Insights</button>
        </div>
      </div>

      <div className="dashboardGrid">
        <div className="statusCard">
          <p>TODAY’S REVENUE</p>
          <h2>Tsh 12,304</h2>
          <span>3.5% higher than yesterday</span>
        </div>
        <div className="statusCard">
          <p>ACTIVE ORDERS</p>
          <h2>24</h2>
          <span>16 Online • 7 Dine-in • 1 Takeaway</span>
        </div>
        <div className="statusCard">
          <p>TABLES OCCUPIED</p>
          <h2>4 / 12</h2>
          <span>8 available</span>
        </div>
        <div className="statusCard">
          <p>RESERVATIONS TODAY</p>
          <h2>2</h2>
          <span>12 upcoming guests</span>
        </div>
      </div>

      <div className="overviewSection">
        <div className="overviewCard chartCard">
          <div className="overviewCardHeader">
            <h2>Revenue overview</h2>
            <div className="toggleButtons">
              <button className="secondaryBtn active">1D</button>
              <button className="secondaryBtn">1W</button>
              <button className="secondaryBtn">1M</button>
              <button className="secondaryBtn">6M</button>
            </div>
          </div>
          <div className="chartPlaceholder">Chart placeholder</div>
        </div>

        <div className="overviewCard ordersCard">
          <div className="overviewCardHeader">
            <h2>Orders</h2>
          </div>
          <div className="orderSummary">
            <div>
              <h3>24</h3>
              <p>Delivery</p>
              <span>16</span>
            </div>
            <div>
              <h3>7</h3>
              <p>Dine-in</p>
              <span>7</span>
            </div>
            <div>
              <h3>1</h3>
              <p>Takeaway</p>
              <span>1</span>
            </div>
          </div>
          <div className="recentOrders">
            <h3>Recent Orders</h3>
            <div className="orderRow">
              <span>OE 69820</span>
              <span>3 items</span>
              <span>Delivery</span>
              <span>Tsh 56,500</span>
              <span className="status ready">Ready</span>
            </div>
            <div className="orderRow">
              <span>OE 69819</span>
              <span>2 items</span>
              <span>Dine-in</span>
              <span>Tsh 38,500</span>
              <span className="status pending">Pending</span>
            </div>
            <div className="orderRow">
              <span>OE 69818</span>
              <span>2 items</span>
              <span>Takeaway</span>
              <span>Tsh 65,000</span>
              <span className="status preparing">Preparing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
