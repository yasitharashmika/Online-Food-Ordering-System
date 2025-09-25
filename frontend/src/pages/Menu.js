import React from 'react'
import "../style/Menu.css";
import pizzaImg from '../assets/pizza.jpg'
import salmonImg from '../assets/salmon.jpg'
import cakeImg from '../assets/cake.jpg'

export default function Menu() {
  return (
    <section className="menu">
      <h1>Our Menu</h1>
      <div className="menu-categories">
        <button className="active">All</button>
        <button>Starters</button>
        <button>Main Course</button>
        <button>Desserts</button>
        <button>Drinks</button>
      </div>

      <div className="menu-items">
        <div className="menu-item">
          <img src={pizzaImg} alt="Margherita Pizza" />
          <span>VEG</span>
          <h3>Margherita Pizza</h3>
          <p>$12.99</p>
          <p>Classic pizza with tomato sauce, mozzarella, and fresh basil</p>
          <button>Add to Cart</button>
        </div>

        <div className="menu-item">
          <img src={salmonImg} alt="Grilled Salmon" />
          <span>NON-VEG</span>
          <h3>Grilled Salmon</h3>
          <p>$18.99</p>
          <p>Fresh salmon fillet grilled to perfection with herbs</p>
          <button>Add to Cart</button>
        </div>

        <div className="menu-item">
          <img src={cakeImg} alt="Chocolate Cake" />
          <h3>Chocolate Cake</h3>
          <p>$6.99</p>
          <p>Rich chocolate cake with ganache frosting</p>
          <button>Add to Cart</button>
        </div>
      </div>
    </section>
  )
}
