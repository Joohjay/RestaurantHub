import "../App.css";

function ManageOrders() {
  return (
    <div className="page">
      <h1>Orders</h1>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>#1001</td>
            <td>John</td>
            <td>Preparing</td>
          </tr>
          <tr>
            <td>#1002</td>
            <td>Sarah</td>
            <td>Delivered</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ManageOrders;