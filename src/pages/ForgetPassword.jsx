import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight } from 'lucide-react';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Yêu cầu reset pass cho email:", email);
    // Logic gửi mail khôi phục mật khẩu sẽ đặt ở đây
    alert("Hệ thống đã gửi link khôi phục vào email của bạn!");
  };

  return (
    <div className="min-h-screen w-full flex font-sans">
      {/* --- CỘT TRÁI: FORM QUÊN MẬT KHẨU --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-10 bg-white relative">
        
        {/* Logo */}
        <Link to="/home" className="absolute top-8 left-8 lg:left-20 flex items-center gap-2">
           <Briefcase className="text-blue-600" size={28} />
           <span className="text-2xl font-bold text-gray-900">MyJob</span>
        </Link>

        {/* Tiêu đề nội dung */}
        <div className="mb-8 mt-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forget Password</h1>
          <p className="text-gray-500 text-sm">
            Go back to <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign In</Link>
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Don't have account? <Link to="/register" className="text-blue-600 font-medium hover:underline">Create Account</Link>
          </p>
        </div>

        {/* Form Nhập Email */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input 
              type="email" 
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address" 
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all text-sm"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            Reset Password 
            <ArrowRight size={20} />
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

        {/* Social Login (Theo Figma) */}
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

      {/* --- CỘT PHẢI: BANNER THỐNG KÊ (Giống Login/Register) --- */}
      <div className="hidden lg:block w-1/2 bg-[#011a33] relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop')",
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
            
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 flex-1 text-center">
                <h3 className="text-xl font-bold">1,75,324</h3>
                <p className="text-xs text-gray-300">Live Job</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 flex-1 text-center">
                <h3 className="text-xl font-bold">97,354</h3>
                <p className="text-xs text-gray-300">Companies</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 flex-1 text-center">
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

export default ForgetPassword;