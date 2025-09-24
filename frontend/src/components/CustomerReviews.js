import React from 'react';
import '../style/CustomerReviews.css'; // Relative path to CSS

function CustomerReviews() {
  const reviews = [
    { id: 1, name: 'John Doe', text: 'Amazing food and great service! Highly recommend this place.', rating: 5 },
    { id: 2, name: 'Jane Smith', text: 'Loved the ambiance and the tasty dishes. Will visit again!', rating: 4 },
    { id: 3, name: 'Mike Wilson', text: 'Quick delivery and delicious meals. Excellent experience.', rating: 5 },
  ];

  return (
    <div className="card">
      <h3>Customer Reviews</h3>
      <div className="reviews-grid">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <h4>{review.name}</h4>
            <p className="rating">{'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)}</p>
            <p className="review-text">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomerReviews;