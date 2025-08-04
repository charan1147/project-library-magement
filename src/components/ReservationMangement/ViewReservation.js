import { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewReservations.css';

function ViewReservations() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Token not found. Please log in.');
          return;
        }
        console.log('Fetching reservations...');
        const response = await axios.get('https://capstone-library-project.onrender.com/api/reservations', {
          headers: { 'x-auth-token': token }
        });
        console.log('API Response:', response.data);

        if (Array.isArray(response.data)) {
          setReservations(response.data);
        } else {
          setError('Unexpected response structure');
        }
      } catch (error) {
        console.error('Error fetching reservations:', error.response?.data?.message || error.message);
        setError(error.response?.data?.message || 'Failed to fetch reservations. Please try again.');
      }
    };

    fetchReservations();
  }, []);

  return (
    <div className="container">
      <h2 className="title">All Reservations</h2>
      {error && <div className="alert alert-error">{error}</div>}
      <ul className="reservation-list">
        {reservations.length > 0 ? (
          reservations.map(reservation => (
            reservation && reservation.book && reservation.book.title ? (
              <li key={reservation._id} className="reservation-item">
                <div><strong>Book Title:</strong> {reservation.book.title}</div>
                <div><strong>User Name:</strong> {reservation.user ? reservation.user.name : 'Unknown User'}</div>
                <div><strong>Reservation Date:</strong> {reservation.dueDate ? new Date(reservation.dueDate).toLocaleDateString() : 'Unknown Date'}</div>
              </li>
            ) : (
              <li key={reservation._id} className="reservation-item">
                <div><strong>Book Title:</strong> Unknown Title</div>
                <div><strong>User Name:</strong> {reservation.user ? reservation.user.name : 'Unknown User'}</div>
                <div><strong>Reservation Date:</strong> {reservation.dueDate ? new Date(reservation.dueDate).toLocaleDateString() : 'Unknown Date'}</div>
              </li>
            )
          ))
        ) : (
          !error && <div className="alert alert-info">No reservations found.</div>
        )}
      </ul>
    </div>
  );
}

export default ViewReservations;
