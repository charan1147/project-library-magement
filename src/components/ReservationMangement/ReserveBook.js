import { useEffect, useState } from "react";
import axios from "axios";
import "./ReserveBook.css";

function ReserveBook() {
  const [bookId, setBookId] = useState("");
  const [userName, setUserName] = useState(""); 
  const [userId, setUserId] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to reserve a book.");
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


        const name =
          response.data.name ||
          response.data.fullName ||
          `${response.data.firstName || ""} ${response.data.lastName || ""}`.trim() ||
          "User";

        setUserName(name);
        setUserId(response.data._id);
        setLoading(false);
      } catch (err) {
        setError("Failed to load your profile. Please try again.");
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleReserveBook = async () => {
    setError(null);
    setSuccess(null);

    if (!userId) {
      setError("User information not available. Please log in again.");
      return;
    }

    if (!bookId.trim()) {
      setError("Please enter a Book ID.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://capstone-library-project.onrender.com/api/reservations",
        {
          bookId,
          userId, 
        },
        {
          headers: {
            "x-auth-token": token,
          },
        },
      );

      setSuccess(`Book reserved successfully for ${userName}!`);
      setBookId("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to reserve book. Please try again.",
      );
    }
  };

  if (loading) {
    return <div className="container">Loading your information...</div>;
  }

  return (
    <div className="container">
      <h2 className="title">Reserve Book</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div
        className="user-info"
        style={{ marginBottom: "1.5rem", fontWeight: "500" }}
      >
        Reserving for:{" "}
        <span style={{ color: "#2c3e50" }}>{userName || "—"}</span>
      </div>

      <div className="form-group">
        <label htmlFor="bookId">Book ID</label>
        <input
          type="text"
          id="bookId"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          placeholder="Enter Book ID"
          required
        />
      </div>


      <button
        className="btn"
        onClick={handleReserveBook}
        disabled={!userId || !bookId.trim()}
      >
        Reserve Book
      </button>
    </div>
  );
}

export default ReserveBook;
