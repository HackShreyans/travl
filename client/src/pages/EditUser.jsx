import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: '',
    email: '',
  });
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/users/${userId}`);
        setUserData(response.data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  console.log()
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Make sure userData has _id field if required by your backend
      const { _id, ...updatedUserData } = userData;
      await axios.put(`http://localhost:3000/api/v1/users/${userId}`, updatedUserData);
      toast.success('User data updated successfully');
      navigate('/dashboard')
      // Redirect to user profile or do something else after successful update
    } catch (error) {
      console.error('Error updating user data:', error);
      toast.error('Error updating user data');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Update User</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Username:</label>
          <input 
            type="text"
            name="name" 
            value={userData.name}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Email:</label>
          <input 
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Update</button>
      </form>
    </div>
  );
};

export default EditUser;




const styles = {
  container: {
    width: '50%',
    margin: 'auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
  title: {
    marginBottom: '20px',
  },
  form: {
    marginTop: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
