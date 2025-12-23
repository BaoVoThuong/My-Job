import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Eye, EyeOff, ArrowRight } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
    console.log("Password Reset:", formData.password);
    alert("Đổi mật khẩu thành công!");
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="mb-8 flex items-center gap-2">
         <Briefcase className="text-blue-600" size={32} />
         <span className="text-2xl font-bold text-gray-900">MyJob</span>
      </div>

      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Reset Password</h1>
        <p className="text-gray-500 text-sm mb-8">Nhập mật khẩu mới của bạn.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input 
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="New Password" 
              className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
              required
              onChange={handleChange}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-3 text-gray-400">
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <input 
              type={showConfirmPass ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password" 
              className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
              required
              onChange={handleChange}
            />
            <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-3 text-gray-400">
              {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 flex items-center justify-center gap-2">
            Reset Password <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-6">
           <Link to="/login" className="text-blue-600 hover:underline">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;