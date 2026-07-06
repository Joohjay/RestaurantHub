import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LuCalendarClock } from "react-icons/lu";
import OrderTracker from "../Components/OrderTracker";
import { useToast } from "../context/ToastContext";
import { API_URL } from "../config";
import { formatCurrency, formatScheduled } from "../utils/format";
import "../App.css";

function OrderReceipt() {
  const { id } = useParams();
  const { success, error: showError } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setError("Failed to load order receipt.");
          return;
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError("Unable to load order receipt. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    const loadOrder = () => {
      fetchOrder();
    };

    queueMicrotask(loadOrder);
  }, [id]);

  const handleMobileMoneyPayment = async () => {
    try {
      setPaymentLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/orders/${id}/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ payment_method: "mobile_money" }),
      });

      const data = await response.json();
      if (!response.ok) {
        showError(data.message || "Failed to process payment.");
        return;
      }

      setOrder(data.order);
      success(data.message || "Payment processed successfully.");
    } catch (err) {
      showError("Unable to process payment. Please try again later.");
      console.error(err);
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) return <div className="dashboardPage"><p>Loading receipt...</p></div>;

  return (
    <div className="dashboardPage">
      <div className="dashboardHeader">
        <div>
          <p className="dashboardLabel">Orders</p>
          <h1>Order Receipt</h1>
          <p className="dashboardSubcopy">Review your order details, items, and payment status.</p>
        </div>
      </div>
      {error && <p className="authError">{error}</p>}
      {order && (
        <div className="receiptCard">
          <h2>Order #{order.id}</h2>
          <OrderTracker status={order.status} />
          <p>Payment: {order.payment_method?.replace("_", " ")} • {order.payment_status}</p>
          <p className="receiptSchedule">
            <LuCalendarClock size={16} style={{ verticalAlign: "middle" }} />{" "}
            {formatScheduled(order.scheduled_date, order.scheduled_time)}
          </p>
          <p>Total: {formatCurrency(order.total_price)}</p>
          {order.payment_method === "cash" && order.payment_status !== "paid" && (
            <p className="mutedText">Cash orders are paid when the order is delivered or collected.</p>
          )}
          {order.payment_method === "mobile_money" && order.payment_status !== "paid" && (
            <button
              className="primaryBtn"
              disabled={paymentLoading}
              onClick={handleMobileMoneyPayment}
            >
              {paymentLoading ? "Processing Payment..." : "Pay with Mobile Money"}
            </button>
          )}
          <div className="cartList">
            {order.order_items?.map((item) => (
              <div key={item.id} className="cartItem">
                <div>
                  <strong>{item.name || `Item #${item.menu_item_id}`}</strong>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <p>{formatCurrency(item.price)}</p>
              </div>
            ))}
          </div>
          <Link to="/profile">
            <button className="primaryBtn">View History</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default OrderReceipt;
