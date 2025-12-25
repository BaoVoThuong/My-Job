import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await login({
        username: formData.username,
        password: formData.password,
      });
      // Navigate to appropriate dashboard based on user role
      if (data.user.role === 'employer') {
        navigate('/employer/dashboard');
      } else if (data.user.role === 'candidate') {
        navigate('/candidate/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex font-sans">
      {/* --- CỘT TRÁI: FORM ĐĂNG NHẬP --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-10 bg-white relative">
        
        {/* Logo */}
        <Link to="/home" className="absolute top-8 left-8 lg:left-20 flex items-center gap-2">
           <Briefcase className="text-blue-600" size={28} />
           <span className="text-2xl font-bold text-gray-900">MyJob</span>
        </Link>

        {/* Tiêu đề */}
        <div className="mb-8 mt-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h1>
          <p className="text-gray-500 text-sm">
            Don't have account?{' '}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">Create Account</Link>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all text-sm"
              required
              onChange={handleChange}
              value={formData.username}
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all text-sm"
              required
              onChange={handleChange}
              value={formData.password}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                name="rememberMe"
                id="rememberMe" 
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                onChange={handleChange}
              />
              <label htmlFor="rememberMe" className="text-gray-500 cursor-pointer select-none">
                Remember Me
              </label>
            </div>
            <Link to="/forgot-password" size={14} className="text-blue-600 hover:underline">
              Forget password
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-400">or</span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700 font-medium">
             <img src="https://www.facebook.com/favicon.ico" alt="FB" className="w-4 h-4" />
             Sign in with Facebook
          </button>
          <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700 font-medium">
             <img src="https://www.google.com/favicon.ico" alt="GG" className="w-4 h-4" />
             Sign in with Google
          </button>
        </div>
      </div>

      {/* --- CỘT PHẢI: BANNER THÔNG TIN (Dựa trên image_579d8f.png) --- */}
      <div className="hidden lg:block w-1/2 bg-[#001f3f] relative overflow-hidden">
        {/* Lớp nền mờ (Overlay) */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'grayscale(100%)'
          }}
        ></div>

        <div className="absolute inset-0 flex flex-col justify-center px-16 text-white z-10">
          <div className="mt-auto mb-20">
            <h2 className="text-4xl font-semibold leading-tight mb-8">
              Over 1,75,324 candidates <br/> waiting for good employees.
            </h2>
            
            {/* Thẻ thống kê */}
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 flex-1">
                <div className="bg-white/20 w-10 h-10 rounded flex items-center justify-center mb-3">
                   <Briefcase size={20} />
                </div>
                <h3 className="text-xl font-bold">1,75,324</h3>
                <p className="text-xs text-gray-300">Live Job</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 flex-1">
                <div className="bg-white/20 w-10 h-10 rounded flex items-center justify-center mb-3">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                </div>
                <h3 className="text-xl font-bold">97,354</h3>
                <p className="text-xs text-gray-300">Companies</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 flex-1">
                <div className="bg-white/20 w-10 h-10 rounded flex items-center justify-center mb-3">
                   <Briefcase size={20} />
                </div>
                <h3 className="text-xl font-bold">7,532</h3>
                <p className="text-xs text-gray-300">New Jobs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;