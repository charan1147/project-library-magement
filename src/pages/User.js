import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./User.css";

function UserDashboard() {
  const [userName, setUserName] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "https://capstone-library-project.onrender.com/api/users/me",
          {
            headers: {
              "x-auth-token": token,
            },
          },
        );

      
        setUserName(response.data.name || "User");
      } catch (err) {
        setError("Failed to fetch user details. Please try again later.");
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
    return <div>Loading user information...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <h2 className="title">User Dashboard</h2>
      {userName && <p>Welcome, {userName}!</p>} 
      <ul className="dashboard-list">
        <li className="dashboard-item">
          <Link to="/reserve-book">Reserve Book</Link>
        </li>
        <li className="dashboard-item">
          <Link to="/borrow-book">Borrow Book</Link>
        </li>
        <li className="dashboard-item">
          <Link to="/return-book/:id">Return Book</Link>
        </li>
        <li className="dashboard-item">
          <Link to="/overdue-books">Overdue Books</Link>
        </li>
        <li className="dashboard-item">
          <Link to="/change-password">Change Password</Link>
        </li>
        <li className="dashboard-item">
          <Link to="/user-reservations">View Reservation</Link>
        </li>
        <li className="dashboard-item">
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
    </div>
  );
}

export default UserDashboard;
