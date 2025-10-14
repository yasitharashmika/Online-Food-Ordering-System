import React, { useEffect, useState } from 'react';
import "../style/Menu.css";
import axios from 'axios';
import API_BASE_URL from '../config';
// --- UPDATE: Import useNavigate for redirection ---
import { useNavigate } from 'react-router-dom';

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  // --- UPDATE: Add state for showing a notification ---
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();

  const fetchMenuItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/menu/all`);
      const itemsWithFullImageUrl = res.data.map(item => ({
        ...item,
        imageUrl: item.imageUrl ? `${API_BASE_URL}${item.imageUrl}` : null
      }));
      setMenuItems(itemsWithFullImageUrl);
    } catch (err) {
      console.error("Error fetching menu items:", err);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  // --- UPDATE START: Function to handle adding items to cart ---
  const handleAddToCart = async (item) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Please log in to add items to your cart.');
        navigate('/login');
        return;
    }

    const cartItemDTO = {
        foodItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1, // Add one at a time from the menu
        userEmail: user.email
    };

    try {
        await axios.post(`${API_BASE_URL}/api/v1/cart/add`, cartItemDTO);
        setNotification(`${item.name} has been added to your cart!`);
        // Hide notification after 3 seconds
        setTimeout(() => setNotification(''), 3000);
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add item to cart. Please try again.');
    }
  };
  // --- UPDATE END ---

  const filteredItems = menuItems.filter(item =>
    selectedCategory === "All" ? true : item.category === selectedCategory
  );

  const categories = ["All", "Starters", "Main Course", "Desserts", "Drinks", "Salads", "Snacks"];

  return (
    <section className="culinary-menu">
      <h1 className="culinary-menu__title">Our Menu</h1>

      {/* --- UPDATE: Display notification if it exists --- */}
      {notification && <div className="culinary-menu__notification">{notification}</div>}

      <div className="culinary-menu__categories">
        {categories.map(cat => (
          <button
            key={cat}
            className={`culinary-menu__cat-button ${selectedCategory === cat ? "culinary-menu__cat-button--active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="culinary-menu__grid">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div className="culinary-menu__card" key={item.id}>
              {item.imageUrl ? (
                <img className="culinary-menu__card-img" src={item.imageUrl} alt={item.name} />
              ) : (
                <div className="culinary-menu__card-no-img">No Image Available</div>
              )}
              <div className="culinary-menu__card-body">
                  <h3 className="culinary-menu__card-title">{item.name}</h3>
                  {item.description && <p className="culinary-menu__card-description">{item.description}</p>}
                  <p className="culinary-menu__card-price">${item.price.toFixed(2)}</p>
                  
                  {/* --- UPDATE: Add the "Add to Cart" button --- */}
                  <button 
                    className="culinary-menu__add-to-cart-btn"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </button>
              </div>
            </div>
          ))
        ) : (
          <p className="culinary-menu__no-items-message">No items to display in this category.</p>
        )}
      </div>
    </section>
  )
}