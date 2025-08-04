import { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

function Profile() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token); 
        const response = await axios.get('https://capstone-library-project.onrender.com/api/users/profile', {
          headers: { 'x-auth-token': token }
        });
        setProfile(response.data.user);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="container">
      <h2 className="title">Profile</h2>
      {loading ? (
        <p>Loading .... Data</p>  
      ) : (
        profile && profile.name && profile.email ? (
          <div>
            <p>Name: {profile.name}</p>
            <p>Email: {profile.email}</p>
          </div>
        ) : (
          <p>Failed to load profile data.</p>  
        )
      )}
    </div>
  );
};

export default Profile;
