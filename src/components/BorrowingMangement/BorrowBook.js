import { useEffect, useState } from "react";
import axios from "axios";
import "./BorrowBook.css";

function BorrowBook() {
  const [bookId, setBookId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [userName, setUserName] = useState(""); 
  const [userId, setUserId] = useState(""); 
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);


  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoadingUser(false);
        return;
      }

      try {
        const res = await axios.get(
          "https://capstone-library-project.onrender.com/api/users/me",
          {
            headers: { "x-auth-token": token },
          },
        );


        const name =
          res.data.name ||
          res.data.fullName ||
          `${res.data.firstName || ""} ${res.data.lastName || ""}`.trim() ||
          "Unknown User";

        setUserName(name);
        setUserId(res.data._id); 
        setLoadingUser(false);
      } catch (err) {
        setError(
          "Failed to load user information. " +
            (err.response?.data?.message || err.message),
        );
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!userId) {
      setError("User information not loaded. Please refresh.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://capstone-library-project.onrender.com/api/borrowing/borrow",
        {
          bookId,
          userId, 
          dueDate,
        },
        {
          headers: { "x-auth-token": token },
        },
      );

      setSuccess(`Book borrowed successfully for ${userName}!`);
      setBookId("");
      setDueDate("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to borrow book. Please try again.",
      );
    }
  };

  if (loadingUser) {
    return <div className="container">Loading user information...</div>;
  }

  return (
    <div className="container">
      <h2 className="title">Borrow Book</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="user-info" style={{ marginBottom: "1.5rem" }}>
        <strong>Borrowing for:</strong> {userName || "—"}
        {userId && (
          <small style={{ display: "block", color: "#666" }}>
            (User ID: {userId})
          </small>
        )}
      </div>

      <form className="form" onSubmit={handleSubmit}>
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

        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>

        <button
          className="btn"
          type="submit"
          disabled={!userId || !bookId || !dueDate}
        >
          Borrow Book
        </button>
      </form>
    </div>
  );
}

export default BorrowBook;
