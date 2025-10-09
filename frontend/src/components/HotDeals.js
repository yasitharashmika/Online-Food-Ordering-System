import React from 'react';
import '../style/HotDeals.css';
import { Link } from 'react-router-dom';

function HotDeals() {
  const deals = [
    {
      id: 1,
      title: 'Spicy Chicken Combo',
      description: 'Juicy chicken with fries and a drink - 20% off!',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGZvb2QlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=80',
      link: '/menu',
    },
    {
      id: 2,
      title: 'Vegan Delight Plate',
      description: 'Healthy vegan meal with fresh veggies - 15% off!',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZCUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=80',
      link: '/menu',
    },
    {
      id: 3,
      title: 'Family Pizza Deal',
      description: 'Large pizza for 4 with free garlic bread - 25% off!',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZvb2QlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=80',
      link: '/menu',
    },
  ];

  return (
    <div className="crave-hot-deals-section">
      <div className="crave-dashboard-grid">
        <div className="card crave-hot-deals-card">
          <h3>Hot Deals</h3>
          <div className="crave-deals-grid">
            {deals.map((deal) => (
              <div key={deal.id} className="crave-deal-card">
                <img src={deal.image} alt={deal.title} className="crave-deal-image" />
                <div className="crave-deal-content">
                  <h4>{deal.title}</h4>
                  <p>{deal.description}</p>
                  <Link to={deal.link} className="crave-deal-btn">Grab Deal</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotDeals;