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

  // ✅ Fetch food items from backend with proper image URL
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/menu/all`)
      .then((res) => res.json())
      .then((data) => {
        const itemsWithFullUrl = data.map((item) => ({
          ...item,
          imageUrl:
            item.imageUrl && !item.imageUrl.startsWith("http")
              ? `${API_BASE_URL}${item.imageUrl}`
              : item.imageUrl,
        }));
        setFoodItems(itemsWithFullUrl);
      })
      .catch((err) => console.error("❌ Failed to fetch food items:", err));
  }, []);

  // ✅ Filter items on search
  useEffect(() => {
    if (search.trim()) {
      const filtered = foodItems.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems([]);
    }
  }, [search, foodItems]);

  // ✅ Add item to order
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
    setFilteredItems([]);
  };

  // ✅ Update quantity
  const updateQuantity = (id, quantity) => {
    const updated = orderItems.map((item) =>
      item.id === id ? { ...item, quantity: Number(quantity) } : item
    );
    setOrderItems(updated);
  };

  // ✅ Remove item
  const removeItem = (id) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  // ✅ Recalculate total
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
      setMessage({
        type: "error",
        text: "Please add items before placing the order!",
      });
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
          addOrder(data.data);
        } else {
          setMessage({ type: "success", text: "✅ Order placed successfully!" });
        }

        setOrderItems([]);
        setTableNumber("");
        setTotal(0);
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
    <div className="new-order-wrapper">
      <div className="new-order-card">
        <h2>New Order</h2>

        {/* ✅ Search Section */}
        <div className="new-order-search-section">
          <input
            type="text"
            placeholder="Search food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {filteredItems.length > 0 && (
            <ul className="new-order-dropdown">
              {filteredItems.map((item) => (
                <li key={item.id} onClick={() => addItem(item)}>
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="new-order-dropdown-img"
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />
                  ) : (
                    <img
                      src="/placeholder.png"
                      alt="No preview"
                      className="new-order-dropdown-img"
                    />
                  )}
                  <span>
                    {item.name} (${item.price})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ✅ Order Items Section */}
        <div className="new-order-items-section">
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

        {/* ✅ Order Summary */}
        <div className="new-order-summary">
          <input
            type="text"
            placeholder="Table number (optional)"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
          />
          <h3>Total: ${total.toFixed(2)}</h3>
          <div className="new-order-payment-buttons">
            <button onClick={() => placeOrder("cash")}>Pay Cash</button>
          </div>
        </div>

        {/* ✅ Message Box */}
        {message && (
          <div
            className={`new-order-message-box ${
              message.type === "success"
                ? "new-order-success"
                : "new-order-error"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}

export default NewOrder;