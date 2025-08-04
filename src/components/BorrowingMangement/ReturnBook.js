import { useState, useEffect } from 'react';
import axios from 'axios';
import "./ReturnBook.css";

function ReturnBook() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Token not found. Please log in.');
          return;
        }
        console.log('Fetching borrowed books...');
        const response = await axios.get('https://capstone-library-project.onrender.com/api/borrowing/user', {
          headers: { 'x-auth-token': token }
        });
        console.log('Borrowed books fetched:', response.data.borrowedBooks);
        setBorrowedBooks(response.data.borrowedBooks);
      } catch (error) {
        console.error('Error fetching borrowed books:', error);
        setError(error.response?.data?.message || 'Failed to fetch borrowed books. Please try again.');
      }
    };
  
    fetchBorrowedBooks();
  }, []);
  
  const handleReturn = async (borrowedId) => {
    setError(null);
    setSuccess(null);
  
    try {
      await axios.put(`https://capstone-library-project.onrender.com/api/borrowing/return/${borrowedId}`, {}, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setSuccess('Book returned successfully!');
      setBorrowedBooks(borrowedBooks.filter(book => book._id !== borrowedId));
    } catch (error) {
      console.error('Error returning book:', error);
      setError(error.response?.data?.message || 'Failed to return book. Please try again.');
    }
  };
  
  return (
    <div className="container">
      <h2 className="title">Return Book</h2>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <ul className="borrowed-book-list">
        {borrowedBooks.map(book => (
          book && book.bookId && book.bookId.title ? (
            <li key={book._id} className="borrowed-book-item">
              <div><strong>Book Title:</strong> {book.bookId.title}</div>
              <button className="btn btn-return" onClick={() => handleReturn(book._id)}>Return Book</button>
            </li>
          ) : ( <div className="alert alert-error">No books found</div>)
        ))}
      </ul>
    </div>
  );
}

export default ReturnBook;
