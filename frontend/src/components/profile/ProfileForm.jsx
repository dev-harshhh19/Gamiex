import React, { useState, useEffect } from 'react';

const ProfileForm = ({ initialData, onSubmit, message, error }) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleCancel = () => {
    setFormData(initialData);
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-semibold text-foreground mb-4">Personal Information</h2>
      <form onSubmit={handleSubmit}>
        {message && <div className="bg-green-100 text-green-800 p-3 rounded-md mb-4 col-span-2">{message}</div>}
        {error && <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4 col-span-2">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-muted-foreground">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-muted-foreground">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-muted-foreground">Phone Number</label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="secondaryEmail" className="block text-sm font-medium text-muted-foreground">Secondary Email</label>
            <input
              type="email"
              id="secondaryEmail"
              name="secondaryEmail"
              value={formData.secondaryEmail || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-muted-foreground">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-muted-foreground">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-muted text-muted-foreground px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors mr-4"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;