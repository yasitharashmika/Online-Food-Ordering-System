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
    const [isHotDeal, setIsHotDeal] = useState(false); // --- UPDATE: State for hot deal checkbox
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");
    const fileInputRef = useRef(null);

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
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", itemName);
        formData.append("price", price);
        formData.append("category", category);
        formData.append("description", description);
        formData.append("isHotDeal", isHotDeal); // --- UPDATE: Append hot deal status
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
            resetForm();
            fetchMenuItems();
        } catch (err) {
            handleError("Error saving item!", err);
        }
    };

    const handleEdit = (item) => {
        setItemName(item.name);
        setPrice(item.price);
        setCategory(item.category);
        setDescription(item.description || "");
        setIsHotDeal(item.isHotDeal); // --- UPDATE: Set checkbox state on edit
        setEditingId(item.id);
        setImage(null);
        if (fileInputRef.current) fileInputRef.current.value = null;
        window.scrollTo(0, 0); // Scroll to top to see the form
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/v1/menu/${id}`);
            setMessage("Item deleted successfully!");
            setTimeout(() => setMessage(""), 3000);
            fetchMenuItems();
        } catch (err) {
            handleError("Error deleting item!", err);
        }
    };
    
    const resetForm = () => {
        setItemName("");
        setPrice("");
        setCategory("Starters");
        setDescription("");
        setImage(null);
        setIsHotDeal(false);
        setEditingId(null);
        if (fileInputRef.current) fileInputRef.current.value = null;
        setTimeout(() => setMessage(""), 3000);
    };
    
    const handleError = (msg, err) => {
        console.error(msg, err);
        setMessage(msg);
        setTimeout(() => setMessage(""), 3000);
    }

    return (
        <AdminLayout>
            <section className="menu-mgmt-section">
                <h1 className="menu-mgmt-title">🍽️ Manage Menu Items</h1>
                {message && <div className="menu-mgmt-message">{message}</div>}

                <form className="menu-mgmt-form" onSubmit={handleSubmit}>
                    {/* Input fields for name, price, description, category */}
                    <input type="text" placeholder="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
                    <input type="number" step="0.01" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                    <textarea placeholder="Short Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                        <option>Starters</option> <option>Main Course</option> <option>Desserts</option> <option>Drinks</option> <option>Salads</option> <option>Snacks</option>
                    </select>
                    <input type="file" onChange={handleImageChange} accept="image/*" ref={fileInputRef} />
                    
                    {/* --- UPDATE: Checkbox for Hot Deal --- */}
                    <div className="checkbox-container">
                        <input type="checkbox" id="hotDeal" checked={isHotDeal} onChange={(e) => setIsHotDeal(e.target.checked)} />
                        <label htmlFor="hotDeal">🔥 Mark as Hot Deal</label>
                    </div>

                    <button type="submit">{editingId ? "Update Item" : "Add Item"}</button>
                    {editingId && <button type="button" onClick={resetForm} className="cancel-btn">Cancel Edit</button>}
                </form>

                <div className="menu-mgmt-card-container">
                    {menuItems.map((item) => (
                        <div key={item.id} className="menu-mgmt-card">
                            {item.isHotDeal && <div className="hot-deal-badge">🔥 Hot Deal</div>} {/* UPDATE */}
                            {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="menu-mgmt-image" /> : <div className="menu-mgmt-no-image">No Image</div>}
                            <div className="menu-mgmt-details">
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                                <p className="menu-mgmt-category">{item.category}</p>
                                <p className="menu-mgmt-price">${item.price}</p>
                                <div className="menu-mgmt-buttons">
                                    <button onClick={() => handleEdit(item)} className="edit-btn">Edit</button>
                                    <button onClick={() => handleDelete(item.id)} className="delete-btn">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </AdminLayout>
    );
}