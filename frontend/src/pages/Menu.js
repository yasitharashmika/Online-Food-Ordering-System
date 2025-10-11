import React, { useEffect, useState } from 'react';
import "../style/Menu.css"; // Ensure this path is correct
import axios from 'axios';
import API_BASE_URL from '../config';

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch all food items from the backend
  const fetchMenuItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/menu/all`);
      // Prepend the base URL to each image URL
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

  // Filter items based on the selected category
  const filteredItems = menuItems.filter(item =>
    selectedCategory === "All" ? true : item.category === selectedCategory
  );

  // Define the list of categories for the filter buttons
  const categories = ["All", "Starters", "Main Course", "Desserts", "Drinks", "Salads", "Snacks"];

  return (
    <section className="culinary-menu">
      <h1 className="culinary-menu__title">Our Menu</h1>

      {/* Category Filter Buttons */}
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

      {/* Menu Items Grid */}
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