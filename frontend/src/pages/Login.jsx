import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext.jsx';

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
    <div className="min-h-screen flex items-center justify-center bg-background animate-fade-in">
      <div className="max-w-md w-full space-y-8 p-8 bg-card border border-border rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">Sign in to your account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Or <Link to="/register" className="font-medium text-primary hover:underline">create a new account</Link>
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && <div className="bg-destructive text-destructive-foreground p-3 rounded-md text-sm">{error}</div>}
          <InputField label="Email" name="email" type="email" register={register} errors={errors} required />
          <InputField label="Password" name="password" type="password" register={register} errors={errors} required />
          <div>
            <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ label, name, type = 'text', register, errors, required }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>
    <input {...register(name, { required: `${label} is required` })} type={type} id={name} className={`w-full px-3 py-2 bg-input border ${errors[name] ? 'border-destructive' : 'border-border'} rounded-md focus:ring-ring focus:border-ring`} />
    {errors[name] && <p className="text-sm text-destructive mt-1">{errors[name].message}</p>}
  </div>
);

export default Login;
