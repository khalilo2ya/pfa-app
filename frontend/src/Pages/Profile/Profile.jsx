import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setError('You are not logged in.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:4000/getUser', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleAddCollection = () => {
    navigate('/add-collection');
  };

  if (loading) return <div style={styles.loading}>Loading profile...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;
  if (!userData) return <div style={styles.error}>No user data found.</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>User Profile</h2>
        <div style={styles.field}>
          <span style={styles.label}>Name:</span> <span>{userData.name}</span>
        </div>
        <div style={styles.field}>
          <span style={styles.label}>Email:</span> <span>{userData.email}</span>
        </div>
        <div style={styles.field}>
          <span style={styles.label}>Admin:</span> <span>{userData.isAdmin ? 'Yes' : 'No'}</span>
        </div>
        <div style={styles.field}>
          <span style={styles.label}>Member since:</span>{' '}
          <span>{new Date(userData.date).toLocaleDateString()}</span>
        </div>
      </div>

      {userData.isAdmin && (
        <div style={styles.adminCard}>
          <h3 style={styles.adminTitle}>Admin Panel</h3>
          <p style={styles.adminText}>You have administrative privileges.</p>
          <button style={styles.adminButton} onClick={handleAddCollection}>
            Add New Collection
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    gap: 30,
    marginTop: 50,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 10,
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    width: 350,
  },
  title: {
    marginBottom: 25,
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    borderBottom: '1px solid #eee',
    paddingBottom: 10,
  },
  field: {
    marginBottom: 15,
    fontSize: 16,
    color: '#555',
  },
  label: {
    fontWeight: '600',
    color: '#222',
    marginRight: 8,
  },
  loading: {
    marginTop: 50,
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
  },
  error: {
    marginTop: 50,
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
  },

  // Admin card styles
  adminCard: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: 30,
    borderRadius: 10,
    color: '#fff',
    width: 350,
    boxShadow: '0 10px 25px rgba(102,126,234,0.4)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  adminTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
  },
  adminText: {
    fontSize: 16,
    marginBottom: 25,
    textAlign: 'center',
  },
  adminButton: {
    padding: '12px 25px',
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(255, 255, 255, 0.6)',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  },
  adminButtonHover: {
    backgroundColor: '#e0e7ff',
    color: '#5a67d8',
  },
};

export default Profile;
