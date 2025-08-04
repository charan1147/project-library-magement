import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import AddBook from './components/BookManagement/AddBook';
import UpdateBook from './components/BookManagement/UpdateBook';
import DeleteBook from './components/BookManagement/DeleteBook';
import SearchBooks from './components/BookManagement/SearchBooks';
import Register from './components/UserMangement/Register';
import Login from './components/UserMangement/Login';
import ChangePassword from './components/UserMangement/ChangePassword';
import Profile from './components/UserMangement/Profile';
import ReserveBook from './components/ReservationMangement/ReserveBook';
import CancelReservation from './components/ReservationMangement/CancelReservation';
import Notifications from './components/NotificationMangement/Notification';
import BorrowBook from './components/BorrowingMangement/BorrowBook';
import ReturnBook from './components/BorrowingMangement/ReturnBook';
import OverdueBooks from './components/BorrowingMangement/OverdueBooks';
import Navigation from './components/Navigation';
import Homepage from './pages/Homepage';
import ViewReservations from './components/ReservationMangement/ViewReservation';
import UserReservations from './components/ReservationMangement/UserResrvation';
import { ProtectedAdminDashboard, ProtectedUserDashboard } from './components/UserMangement/ProtectedRoutes';

function App(){
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await axios.get('https://capstone-library-project.onrender.com/api/users/me');
      console.log('User Details:', response.data);
      setIsLoggedIn(true);
      setUserRole(response.data.role);
    } catch (error) {
      console.error('Error fetching user details:', error.response?.data?.message || error.message);
      setIsLoggedIn(false);
      setUserRole('');
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      fetchUserDetails();
    }
  }, [fetchUserDetails]);

  const handleLogin = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setUserRole('');
  };

  return (
    <Router>
      <div className="app-container">
        <Navigation isLoggedIn={isLoggedIn} userRole={userRole} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/dashboard" element={isLoggedIn ? <Navigate to={userRole === 'admin' ? '/admin-dashboard' : '/user-dashboard'} /> : <Login handleLogin={handleLogin} />} />
          <Route path="/admin-dashboard" element={isLoggedIn && userRole === 'admin' ? <ProtectedAdminDashboard /> : <Login handleLogin={handleLogin} />} />
          <Route path="/user-dashboard" element={isLoggedIn && userRole === 'user' ? <ProtectedUserDashboard /> : <Login handleLogin={handleLogin} />} />
          <Route path="/add-book" element={isLoggedIn && userRole === 'admin' ? <AddBook /> : <Login handleLogin={handleLogin} />} />
          <Route path="/books/update/:id" element={isLoggedIn && userRole === 'admin' ? <UpdateBook /> : <Login handleLogin={handleLogin} />} />
          <Route path="/delete-book/:id" element={isLoggedIn && userRole === 'admin' ? <DeleteBook /> : <Login handleLogin={handleLogin} />} />
          <Route path="/books/search" element={<SearchBooks />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login handleLogin={handleLogin} />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/profile" element={isLoggedIn ? <Profile /> : <Login handleLogin={handleLogin} />} />
          <Route path="/reserve-book" element={isLoggedIn && userRole === 'user' ? <ReserveBook /> : <Login handleLogin={handleLogin} />} />
          <Route path="/user-reservations" element={isLoggedIn && userRole === 'user' ? <UserReservations /> : <Login handleLogin={handleLogin} />} />
          <Route path="/view-reservations" element={isLoggedIn && userRole === 'admin' ? <ViewReservations /> : <Login handleLogin={handleLogin} />} />
          <Route path="/cancel-reservation/:reservationId" element={isLoggedIn ? <CancelReservation /> : <Login handleLogin={handleLogin} />} />
          <Route path="/notifications" element={isLoggedIn ? <Notifications /> : <Login handleLogin={handleLogin} />} />
          <Route path="/borrow-book" element={isLoggedIn && userRole === 'user' ? <BorrowBook /> : <Login handleLogin={handleLogin} />} />
          <Route path="/return-book/:id" element={isLoggedIn && userRole === 'user' ? <ReturnBook /> : <Login handleLogin={handleLogin} />} />
          <Route path="/overdue-books" element={isLoggedIn && userRole === 'user' ? <OverdueBooks /> : <Login handleLogin={handleLogin} />} />
          <Route path="*" element={<Homepage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
