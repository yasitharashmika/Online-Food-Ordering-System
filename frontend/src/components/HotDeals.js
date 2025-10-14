import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config'; // Make sure you have this config file
import '../style/HotDeals.css';

function HotDeals() {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHotDeals = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/v1/menu/hot-deals`);
                // Add the full image URL and take only the first 3 items
                const processedDeals = response.data.map(item => ({
                    ...item,
                    imageUrl: item.imageUrl ? `${API_BASE_URL}${item.imageUrl}` : 'default-image-url.jpg', // Fallback image
                })).slice(0, 3);
                setDeals(processedDeals);
            } catch (error) {
                console.error("Failed to fetch hot deals:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHotDeals();
    }, []);

    if (loading) {
        return <div className="crave-hot-deals-section"><p>Loading deals...</p></div>;
    }
    
    if (deals.length === 0) {
        return null; // Don't render the section if there are no deals
    }

    return (
        <div className="crave-hot-deals-section">
            <div className="crave-dashboard-grid">
                <div className="card crave-hot-deals-card">
                    <h3>Hot Deals</h3>
                    <div className="crave-deals-grid">
                        {deals.map((deal) => (
                            <div key={deal.id} className="crave-deal-card">
                                <img src={deal.imageUrl} alt={deal.name} className="crave-deal-image" />
                                <div className="crave-deal-content">
                                    <h4>{deal.name}</h4>
                                    <p>{deal.description}</p>
                                    <Link to="/menu" className="crave-deal-btn">Grab Deal</Link>
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