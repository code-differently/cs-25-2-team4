import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useHomes } from '../../hooks/useHomes';
import './CreateHome.css';
import AddressForm from '../../components/AddressForm';

const CreateHome = ({ onHomeCreated }) => {
  const navigate = useNavigate();
  const { backendUser } = useUser();
  const { createHome } = useHomes(backendUser?.clerkId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [homeData, setHomeData] = useState({
    name: '',
    address: {},
    type: ''
  });

  const handleInputChange = (e) => {
    setHomeData({
      ...homeData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddressChange = useCallback((address) => {
    setHomeData(prev => ({ ...prev, address }));
  }, []);

  const formatAddress = (addressObj) => {
    const parts = [];
    
    if (addressObj.streetAddress) parts.push(addressObj.streetAddress.trim());
    if (addressObj.city) parts.push(addressObj.city.trim());
    if (addressObj.state) parts.push(addressObj.state.trim());
    if (addressObj.zipCode) parts.push(addressObj.zipCode.trim());
    if (addressObj.country) parts.push(addressObj.country.trim());
    
    return parts.join(', ');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formattedAddress = formatAddress(homeData.address);
    
    // Validation
    if (!homeData.name || !homeData.name.trim()) {
      setError('Please enter a home name.');
      return;
    }

    if (!formattedAddress) {
      setError('Please fill in at least one address field.');
      return;
    }

    if (!homeData.type) {
      setError('Please select a home type.');
      return;
    }

    if (!backendUser?.clerkId) {
      setError('User authentication required.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const payload = {
        name: homeData.name.trim(),
        address: formattedAddress,
        clerkId: backendUser.clerkId
      };

      const newHome = await createHome(payload);

      console.log('Success! New home created:', newHome);

      // Call the callback if provided
      if (onHomeCreated) {
        onHomeCreated(newHome);
      }

      // Navigate to home page
      navigate('/');
      
    } catch (err) {
      console.error('Error creating home:', err);
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
          required
        />

        <AddressForm
          onAddressChange={handleAddressChange}
          initialAddress={homeData.address}
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