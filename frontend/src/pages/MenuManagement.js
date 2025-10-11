import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import AdminLayout from "../components/admin/AdminLayout";
import "../style/MenuManagement.css";
import API_BASE_URL from "../config";

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Starters");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  // Fetch menu items
  const fetchMenuItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/menu/all`);
      const itemsWithFullImageUrl = res.data.map((item) => ({
        ...item,
        imageUrl: item.imageUrl ? `${API_BASE_URL}${item.imageUrl}` : null,
      }));
      setMenuItems(itemsWithFullImageUrl);
    } catch (err) {
      console.error("Error fetching menu items:", err);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  // Add or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", itemName);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/v1/menu/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Item updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/api/v1/menu/add`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("New item added successfully!");
      }

      setItemName("");
      setPrice("");
      setCategory("Starters");
      setDescription("");
      setImage(null);
      setEditingId(null);
      if (fileInputRef.current) fileInputRef.current.value = null;

      fetchMenuItems();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error saving menu item:", err);
      setMessage("Error saving item!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleEdit = (item) => {
    setItemName(item.name);
    setPrice(item.price);
    setCategory(item.category);
    setDescription(item.description || "");
    setEditingId(item.id);
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/v1/menu/${id}`);
      setMessage("Item deleted successfully!");
      fetchMenuItems();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error deleting menu item:", err);
      setMessage("Error deleting item!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <AdminLayout>
      <section className="menu-mgmt-section">
        <h1 className="menu-mgmt-title">🍽️ Manage Menu Items</h1>

        {message && <div className="menu-mgmt-message">{message}</div>}

        <form className="menu-mgmt-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <textarea
            placeholder="Short Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option>Starters</option>
            <option>Main Course</option>
            <option>Desserts</option>
            <option>Drinks</option>
            <option>Salads</option>
            <option>Snacks</option>
          </select>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            ref={fileInputRef}
          />
          <button type="submit">
            {editingId ? "Update Item" : "Add Item"}
          </button>
        </form>

        <div className="menu-mgmt-card-container">
          {menuItems.map((item) => (
            <div key={item.id} className="menu-mgmt-card">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="menu-mgmt-image"
                />
              ) : (
                <div className="menu-mgmt-no-image">No Image</div>
              )}
              <div className="menu-mgmt-details">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p className="menu-mgmt-category">{item.category}</p>
                <p className="menu-mgmt-price">${item.price}</p>
                <div className="menu-mgmt-buttons">
                  <button onClick={() => handleEdit(item)} className="edit-btn">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
