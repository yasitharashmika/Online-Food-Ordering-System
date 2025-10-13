import React, { useState, useEffect } from 'react';
// --- UPDATE: Import axios for API calls and the base URL ---
import axios from 'axios';
import API_BASE_URL from '../../config';

const DashboardProfile = () => {
    // --- UPDATE: Add loading and error states for feedback ---
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        // --- UPDATE: This function now fetches data from your backend ---
        const fetchProfileData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Get user info and token from localStorage
                const user = JSON.parse(localStorage.getItem("user"));
                const token = localStorage.getItem("token");

                if (!user || !user.email || !token) {
                    setError("You are not authorized. Please log in again.");
                    setLoading(false);
                    return;
                }
                
                // Make the API call to your backend endpoint
                const response = await axios.get(
                    `${API_BASE_URL}/api/v1/user/profile/${user.email}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                // The actual profile data is nested in response.data.data
                setProfileData(response.data.data);

            } catch (err) {
                console.error("Failed to fetch profile data:", err);
                setError("Could not load your profile. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []); // Empty array ensures this runs only once on mount

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value
            }
        }));
    };

    // --- UPDATE: This function now sends the updated data to the backend ---
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setError(null);

        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const token = localStorage.getItem("token");

            if (!user || !user.email || !token) {
                setError("Your session has expired. Please log in again.");
                return;
            }

            // Make the PUT request to update the profile
            await axios.put(
                `${API_BASE_URL}/api/v1/user/profile/${user.email}`,
                profileData, // The request body is the current state
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Update localStorage with the new name if it changed
            if (user.name !== profileData.name) {
                const updatedUser = { ...user, name: profileData.name };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
            
            setSuccessMessage("Profile updated successfully!");

        } catch (err) {
            console.error("Failed to update profile:", err);
            setError("Failed to update profile. Please try again.");
        }
    };

    // --- UPDATE: Handle loading and error states ---
    if (loading) {
        return <div>Loading profile...</div>;
    }

    if (error) {
        return <div className="dashboard-error" style={{ color: 'red' }}>{error}</div>;
    }
    
    if (!profileData) {
        return <div>No profile data found.</div>;
    }


    return (
        <div className="tab-content">
            <div className="content-section">
                <h2>Profile Management</h2>
                <form className="profile-form" onSubmit={handleProfileUpdate}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" name="name" value={profileData.name || ''} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" value={profileData.email || ''} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="tel" name="phone" value={profileData.phone || ''} onChange={handleInputChange} />
                    </div>

                    <h3 className="form-subheading">Delivery Address</h3>
                    <div className="form-group">
                        <label>Street Address</label>
                        <input type="text" name="street" value={profileData.address?.street || ''} onChange={handleAddressChange} />
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>City</label>
                            <input type="text" name="city" value={profileData.address?.city || ''} onChange={handleAddressChange} />
                        </div>
                        <div className="form-group">
                            <label>Postal Code</label>
                            <input type="text" name="postalCode" value={profileData.address?.postalCode || ''} onChange={handleAddressChange} />
                        </div>
                    </div>
                    
                    {/* --- UPDATE: Show success or error messages --- */}
                    {successMessage && <p style={{ color: 'lightgreen' }}>{successMessage}</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    
                    <button type="submit" className="save-btn">Update Profile</button>
                </form>
            </div>
        </div>
    );
};

export default DashboardProfile;