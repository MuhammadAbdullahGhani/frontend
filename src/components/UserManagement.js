import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    role: 'admin',
  });

  // Navbar Component
  const Navbar = () => {
    return (
        <nav className="bg-white p-4 shadow-md">
        <div className="flex justify-between items-center container mx-auto">
          <div className="flex items-center space-x-4">
            <input 
              type="text" 
              placeholder="Search..." 
              className="border rounded-full border-black p-2" 
            />
            <div className="space-x-4 text-gray-700">
              <Link to="/user-management" className="hover:text-indigo-200">User Management</Link>
              <Link to="/skill-management" className="hover:text-indigo-200">Skill Management</Link>
              <Link to="/login" className="hover:text-indigo-200">Logout</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <span>EN</span>
              <span className="material-icons">language</span>
            </div>
            <Link to="/login" className="bg-transparent border-2 border-black text-black rounded-full py-2 px-6 hover:bg-black hover:text-white transition">Log In</Link>
            <Link to="/signup" className="bg-purple-600 text-white rounded-full p-2 py-2 px-6 border-black hover:bg-purple-700">Sign Up</Link>
          </div>
        </div>
      </nav>
    );
  };



  
  // Fetch users from the backend
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      } else {
        setError('Error fetching users');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  // Handle user form change
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle submit for adding or updating a user
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = selectedUser ? 'PUT' : 'POST';
    const url = selectedUser
      ? `http://localhost:5000/api/users/${selectedUser._id}`
      : 'http://localhost:5000/api/users/create';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        fetchUsers();
        setIsModalOpen(false);
        setFormData({ name: '', email: '', mobile: '', role: 'admin' });
      } else {
        setError(result.message || 'Something went wrong!');
      }
    } catch (err) {
      setError('Error during form submission');
    }
  };

  // Handle delete user
  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchUsers();
        } else {
          setError('Error deleting user');
        }
      } catch (err) {
        setError('Error during delete request');
      }
    }
  };

  // Open modal for create/update user
  const openModal = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setFormData({ ...user });
    } else {
      setSelectedUser(null);
      setFormData({ name: '', email: '', mobile: '', role: 'admin' });
    }
    setIsModalOpen(true);
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-semibold mb-4">User Management</h1>
        <button
          onClick={() => openModal()}
          className="bg-indigo-900 text-white py-2 px-4 rounded-md mb-4 hover:bg-indigo-800"
        >
          Add New User
        </button>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-indigo-900 text-white">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Mobile</th>
                <th className="py-2 px-4">Role</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="border py-2 px-4">{user.name}</td>
                  <td className="border py-2 px-4">{user.email}</td>
                  <td className="border py-2 px-4">{user.mobile}</td>
                  <td className="border py-2 px-4">{user.role}</td>
                  <td className="border py-2 px-4">
                    <button
                      onClick={() => openModal(user)}
                      className="bg-yellow-400 text-white py-1 px-3 rounded-md mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white py-1 px-3 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for Create/Update */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-1/3">
              <h2 className="text-xl font-semibold mb-4">{selectedUser ? 'Edit User' : 'Create User'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full border rounded-md p-2 bg-gray-50"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full border rounded-md p-2 bg-gray-50"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile</label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleFormChange}
                    className="w-full border rounded-md p-2 bg-gray-50"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                    className="w-full border rounded-md p-2 bg-gray-50"
                  >
                    <option value="admin">Admin</option>
                    <option value="attendee">Attendee</option>
                    <option value="organizer">Organizer</option>
                    <option value="vendor">Vendor</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-indigo-900 text-white py-2 px-4 rounded-md mr-2"
                  >
                    {selectedUser ? 'Update' : 'Create'} User
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-500 text-white py-2 px-4 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;
