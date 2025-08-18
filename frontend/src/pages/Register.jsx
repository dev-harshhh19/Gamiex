import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    const result = await registerUser(data.name, data.email, data.password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background animate-fade-in">
      <div className="max-w-md w-full space-y-8 p-8 bg-card border border-border rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">Create a new account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Or <Link to="/login" className="font-medium text-primary hover:underline">sign in to your existing account</Link>
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && <div className="bg-destructive text-destructive-foreground p-3 rounded-md text-sm">{error}</div>}
          <InputField label="Full Name" name="name" register={register} errors={errors} required />
          <InputField label="Email" name="email" type="email" register={register} errors={errors} required />
          <InputField label="Password" name="password" type="password" register={register} errors={errors} required />
          <InputField label="Confirm Password" name="confirmPassword" type="password" register={register} errors={errors} required validate={{ validate: value => value === password || 'Passwords do not match' }} />
          <div>
            <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ label, name, type = 'text', register, errors, required, validate = {} }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>
    <input {...register(name, { required: `${label} is required`, ...validate })} type={type} id={name} className={`w-full px-3 py-2 bg-input border ${errors[name] ? 'border-destructive' : 'border-border'} rounded-md focus:ring-ring focus:border-ring`} />
    {errors[name] && <p className="text-sm text-destructive mt-1">{errors[name].message}</p>}
  </div>
);

export default Register;
