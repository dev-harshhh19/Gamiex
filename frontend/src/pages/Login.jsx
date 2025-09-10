import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/auth-forms.css';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    const result = await login(data.email, data.password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center auth-container">
      <div className="max-w-md w-full space-y-8 p-8 auth-card">
        <div className="text-center">
          <h2 className="text-4xl font-bold auth-title mb-4">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-medium auth-link">
              Sign up here
            </Link>
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && <div className="bg-red-500 text-white p-3 rounded-md text-sm">{error}</div>}
          <InputField label="Email" name="email" type="email" register={register} errors={errors} required />
          <InputField label="Password" name="password" type="password" register={register} errors={errors} required />
          <div>
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full auth-button text-white py-3 px-6 rounded-lg font-semibold text-lg disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ label, name, type = 'text', register, errors, required }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
    <input
      {...register(name, { required: `${label} is required` })}
      type={type}
      id={name}
      className={`w-full px-4 py-3 auth-input rounded-lg ${errors[name] ? 'border-red-500' : ''}`}
      placeholder={`Enter your ${label.toLowerCase()}`}
    />
    {errors[name] && (
      <p className="text-sm text-red-400 mt-2">{errors[name].message}</p>
    )}
  </div>
);

export default Login;
