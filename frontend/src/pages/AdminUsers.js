import React, { useState, useEffect } from "react";
import AdminLayout from "../components/admin/AdminLayout";
import API_BASE_URL from "../config";
import "../style/AdminUsers.css";

function AdminUsers() {
  const [staffList, setStaffList] = useState([]);
  const [newStaff, setNewStaff] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch all staff members
  const fetchStaff = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/staff/all-staff`);
      const data = await response.json();
      setStaffList(data);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Create new staff
  const handleCreateStaff = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/staff/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newStaff.name,
          email: newStaff.email,
          password: newStaff.password,
          role: "STAFF",
        }),
      });

      if (response.ok) {
        setMessage("✅ Staff member created successfully!");
        setNewStaff({ name: "", email: "", password: "" });
        fetchStaff();
      } else {
        setMessage("❌ Failed to create staff. Try again.");
      }
    } catch (error) {
      console.error("Error creating staff:", error);
      setMessage("❌ Something went wrong.");
    }

    setLoading(false);
  };

  // Delete staff member
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/staff/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage("🗑️ Staff member deleted.");
        setStaffList(staffList.filter((s) => s.id !== id));
      } else {
        setMessage("❌ Failed to delete staff.");
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  return (
    <AdminLayout title="Manage Staff" subtitle="Create and manage system staff members">
      <div className="admin-users-container">
        {/* Create Staff Form */}
        <div className="card create-staff-card">
          <h3>Create New Staff</h3>
          <form className="create-staff-form" onSubmit={handleCreateStaff}>
            <input
              type="text"
              placeholder="Full Name"
              value={newStaff.name}
              onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={newStaff.email}
              onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={newStaff.password}
              onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Staff"}
            </button>
          </form>
          {message && <p className="message">{message}</p>}
        </div>

        {/* Staff List */}
        <div className="card staff-list-card">
          <h3>All Staff Members</h3>
          {staffList.length === 0 ? (
            <p>No staff members found.</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff, index) => (
                  <tr key={staff.id}>
                    <td>{index + 1}</td>
                    <td>{staff.name}</td>
                    <td>{staff.email}</td>
                    <td>{staff.role}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(staff.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminUsers;
