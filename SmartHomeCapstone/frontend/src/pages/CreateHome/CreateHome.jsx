import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { useHomes } from '../../hooks/useHomes';
import './CreateHome.css';

const CreateHome = ({ onHomeCreated }) => {
  const { backendUser } = useUser();
  const { createHome } = useHomes(backendUser?.clerkId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [homeData, setHomeData] = useState({
    name: '',
    address: '',
    type: ''
  });

  const handleInputChange = (e) => {
    setHomeData({
      ...homeData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!homeData.name || !homeData.address || !homeData.type) {
      setError('Please fill in all fields.');
      return;
    }

    if (!backendUser?.clerkId) {
      setError('User authentication required.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const newHome = await createHome({
        name: homeData.name.trim(),
        address: homeData.address.trim(),
        clerkId: backendUser.clerkId
      });

      // Call the callback to notify parent component
      if (onHomeCreated) {
        onHomeCreated(newHome);
      }
    } catch (err) {
      setError(err.message || 'Failed to create home. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form onSubmit={handleSubmit} className="create-home-card">
        <h2 className="title">Create Your First Smart Home</h2>
        <p className="subtitle">Let's set up your smart home to get started!</p>

        <label>Home Name</label>
        <input
          className="input"
          name="name"
          value={homeData.name}
          onChange={handleInputChange}
          placeholder="e.g., My Family Home"
          disabled={loading}
        />

        <label>Address</label>
        <input
          className="input"
          name="address"
          value={homeData.address}
          onChange={handleInputChange}
          placeholder="e.g., 123 Main Street, City, State"
          disabled={loading}
        />

        <label>Home Type</label>
        <select
          className="select mb16"
          name="type"
          value={homeData.type}
          onChange={handleInputChange}
          disabled={loading}
        >
          <option value="">Select home type...</option>
          <option value="Single Family">Single Family</option>
          <option value="Apartment">Apartment</option>
          <option value="Townhouse">Townhouse</option>
          <option value="Condo">Condo</option>
          <option value="Other">Other</option>
        </select>

        <button
          type="submit"
          className="btn-primary btn-full"
          disabled={loading}
        >
          {loading ? 'Creating Home...' : 'Create Smart Home'}
        </button>

        {error && <div className="error-msg">{error}</div>}
      </form>
    </div>
  );
};

export default CreateHome;