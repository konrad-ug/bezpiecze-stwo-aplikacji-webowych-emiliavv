import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import keycloak from "../../keycloak";
import "./OrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isAdmin = keycloak.hasRealmRole("admin");

  useEffect(() => {
    console.log('Token:', keycloak.token);
    console.log('Is authenticated:', keycloak.authenticated);
    console.log('User roles:', keycloak.realmAccess?.roles);
    const fetchOrders = async () => {
      try {
        await keycloak.updateToken(30);
        const response = await axios.get("http://localhost:3001/api/order-history", {
          headers: {
            Authorization: `Bearer ${keycloak.token}`
          }
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error details:', error);
        setError(error.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    if (keycloak.authenticated) {
      fetchOrders();
    }
  }, []);

  if (!keycloak.authenticated) {
    return (
      <div>
        <Navbar />
        <div className="order-history">
          <h2>You need to log in first</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="order-history">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="order-history">
          <h2>Error: {error}</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="order-history">
        <h1 className="order-title">Order History</h1>
        {orders.length === 0 ? (
          <p className="no-orders">No orders found</p>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <h3>Order #{order.id}</h3>
                  <span className="order-date">
                    {new Date(order.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="order-content">
                  {isAdmin && <p>User: {order.user}</p>}
                  <p>Items:</p>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {typeof item === 'string' 
                          ? item 
                          : `${item.productName || item.name} (${item.quantity}x $${item.price})`}
                      </li>
                    ))}
                  </ul>
                  <p>Total: ${order.total}</p>
                  <p>Status: {order.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
