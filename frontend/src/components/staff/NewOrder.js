import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../config";
import "../../style/NewOrder.css";

function NewOrder({ addOrder }) {
  const [foodItems, setFoodItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [tableNumber, setTableNumber] = useState("");
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState(null);

  // ✅ Get staff info from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const staffEmail = user.email || "staff@system.com";

  // Fetch all food items
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/food`)
      .then((res) => res.json())
      .then((data) => setFoodItems(data))
      .catch((err) => console.error("Failed to fetch food items", err));
  }, []);

  // Filter items
  useEffect(() => {
    if (search) {
      const filtered = foodItems.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems([]);
    }
  }, [search, foodItems]);

  // Add item
  const addItem = (item) => {
    const exists = orderItems.find((i) => i.id === item.id);
    if (exists) {
      const updated = orderItems.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
      setOrderItems(updated);
    } else {
      setOrderItems([...orderItems, { ...item, quantity: 1 }]);
    }
    setSearch("");
  };

  // Update quantity
  const updateQuantity = (id, quantity) => {
    const updated = orderItems.map((item) =>
      item.id === id ? { ...item, quantity: Number(quantity) } : item
    );
    setOrderItems(updated);
  };

  // Remove item
  const removeItem = (id) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  // Calculate total
  useEffect(() => {
    const totalValue = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(totalValue);
  }, [orderItems]);

  // ✅ Place order
  const placeOrder = (paymentMethod) => {
    if (orderItems.length === 0) {
      setMessage({ type: "error", text: "Please add items before placing the order!" });
      return;
    }

    const items = orderItems.map((i) => `${i.name} x${i.quantity}`);

    fetch(
      `${API_BASE_URL}/api/v1/order/create?placedBy=${encodeURIComponent(
        staffEmail
      )}&paymentMethod=${encodeURIComponent(
        paymentMethod
      )}&totalAmount=${total}&tableNumber=${encodeURIComponent(
        tableNumber || ""
      )}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.data && data.data.orderId) {
          setMessage({
            type: "success",
            text: `✅ Order placed successfully! Order ID: ${data.data.orderId}`,
          });
          // Pass order to parent to auto-update dashboard
          addOrder(data.data);
        } else {
          setMessage({ type: "success", text: "✅ Order placed successfully!" });
        }

        setOrderItems([]);
        setTableNumber("");
        setTotal(0);

        // Auto-hide message after 5 seconds
        setTimeout(() => setMessage(null), 5000);
      })
      .catch(() =>
        setMessage({
          type: "error",
          text: "❌ Failed to place order. Please try again.",
        })
      );
  };

  return (
    <div className="new-order-container new-order-card">
      <h2>New Order</h2>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {filteredItems.length > 0 && (
          <ul className="dropdown">
            {filteredItems.map((item) => (
              <li key={item.id} onClick={() => addItem(item)}>
                {item.name} (${item.price})
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="order-items-section">
        {orderItems.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>${item.price}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, e.target.value)
                      }
                    />
                  </td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button onClick={() => removeItem(item.id)}>X</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No items added yet.</p>
        )}
      </div>

      <div className="order-summary">
        <input
          type="text"
          placeholder="Table number (optional)"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
        />
        <h3>Total: ${total.toFixed(2)}</h3>
        <div className="payment-buttons">
          <button onClick={() => placeOrder("cash")}>Pay Cash</button>
        </div>
      </div>

      {/* ✅ Message display */}
      {message && (
        <div
          className={`message-box ${message.type === "success" ? "success" : "error"}`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}

export default NewOrder;
