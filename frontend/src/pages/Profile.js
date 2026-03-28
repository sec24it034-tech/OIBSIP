import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfile, updateUserAddress } from '../api';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfile({ name: formData.name, phone: formData.phone });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserAddress(formData);
      toast.success('Address updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <h1 className="text-center mb-3">My Profile</h1>

      <div className="grid grid-2">
        {/* Profile Information */}
        <div className="card">
          <h3>Profile Information</h3>
          <form onSubmit={handleProfileUpdate}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={user?.email || ''}
                className="form-control"
                disabled
              />
              <small style={{ color: '#666' }}>Email cannot be changed</small>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Address Information */}
        <div className="card">
          <h3>Shipping Address</h3>
          <form onSubmit={handleAddressUpdate}>
            <div className="form-group">
              <label>Street Address</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Address'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;