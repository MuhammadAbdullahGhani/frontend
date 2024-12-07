import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Navbar component
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

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Fetch bookings using the fetch API
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/bookings');
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  // Handle booking approval
  const handleApproval = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${id}/approve`, {
        method: 'PUT',
      });
      const updatedBooking = await response.json();

      if (response.ok) {
        setBookings(bookings.map((booking) => 
          booking._id === id ? updatedBooking : booking
        ));
      } else {
        console.error('Error approving the booking');
      }
    } catch (error) {
      console.error("Error approving the booking:", error);
    }
  };

  // Handle booking rejection
  const handleRejection = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${id}/reject`, {
        method: 'PUT',
      });
      const updatedBooking = await response.json();

      if (response.ok) {
        setBookings(bookings.map((booking) => 
          booking._id === id ? updatedBooking : booking
        ));
      } else {
        console.error('Error rejecting the booking');
      }
    } catch (error) {
      console.error("Error rejecting the booking:", error);
    }
  };

  return (
    <div className="bg-purple-50 font-montserrat min-h-screen py-6">
      {/* Navbar */}
      <Navbar />
      <h2 className="text-3xl font-semibold text-purple-700 text-center mb-8">Bookings List</h2>
      <div className="container mx-auto p-4 flex flex-wrap justify-center gap-8">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking._id} className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg w-full sm:w-80 md:w-96 lg:w-1/4">
              <p>
                <strong className="block text-purple-600">Student:</strong> {booking.student ? booking.student.name : 'N/A'}<br />
                <strong className="block text-purple-600">Instructor:</strong> {booking.instructor ? booking.instructor.name : 'N/A'}<br />
                <strong className="block text-purple-600">Skill:</strong> {booking.skill ? booking.skill.name : 'N/A'}<br />
                <strong className="block text-purple-600">Status:</strong> {booking.status}<br />
                <strong className="block text-purple-600">Date:</strong> {new Date(booking.date).toLocaleString()}<br />
                
                {/* Approval and Rejection buttons */}
                {booking.status === 'pending' && (
                  <div className="mt-4 flex justify-around">
                    <button 
                      className="bg-purple-700 text-white py-2 px-6 rounded-full hover:bg-purple-800 transition"
                      onClick={() => handleApproval(booking._id)}
                    >
                      Approve
                    </button>
                    <button 
                      className="bg-red-600 text-white py-2 px-6 rounded-full hover:bg-red-700 transition"
                      onClick={() => handleRejection(booking._id)}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No bookings available.</p>
        )}
      </div>
    </div>
  );
};

export default BookingsList;
