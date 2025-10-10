import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../components/admin/AdminLayout";
import "../style/MenuManagement.css"; // import your CSS
import API_BASE_URL from "../config";

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Starters");
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Fetch menu items
  const fetchMenuItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/menu/all`);
      setMenuItems(res.data);
    } catch (err) {
      console.error("Error fetching menu items:", err);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Add or update menu item
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", itemName);
    formData.append("price", price);
    formData.append("category", category);
    if (image) formData.append("image", image);

    try {
      if (editingId) {
        // Update item
        await axios.put(`${API_BASE_URL}/menu/${editingId}`, formData);
      } else {
        // Add new item
        await axios.post(`${API_BASE_URL}/menu/add`, formData);
      }

      // Reset form
      setItemName("");
      setPrice("");
      setCategory("Starters");
      setImage(null);
      setEditingId(null);

      fetchMenuItems();
    } catch (err) {
      console.error("Error saving menu item:", err);
    }
  };

  // Edit menu item
  const handleEdit = (item) => {
    setItemName(item.name);
    setPrice(item.price);
    setCategory(item.category);
    setEditingId(item.id);
  };

  // Delete menu item
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/menu/${id}`);
      fetchMenuItems();
    } catch (err) {
      console.error("Error deleting menu item:", err);
    }
  };

  return (
    <AdminLayout>
      <section className="menu-management">
        <h1>Manage Menu Items</h1>

        <form className="menu-form" onSubmit={handleSubmit}>
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
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Starters</option>
            <option>Main Course</option>
            <option>Desserts</option>
            <option>Drinks</option>
          </select>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
          />
          <button type="submit">{editingId ? "Update Item" : "Add Item"}</button>
        </form>

        <div className="menu-items-table">
          {menuItems.map((item) => (
            <div key={item.id} className="menu-item">
              <img src={item.imageUrl} alt={item.name} />
              <div className="item-details">
                <h3>{item.name}</h3>
                <p>Category: {item.category}</p>
                <p>Price: ${item.price}</p>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
