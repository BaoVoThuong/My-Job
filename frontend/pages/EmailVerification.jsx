import React from 'react';
import { Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmailVerification = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      {/* Logo */}
      <div className="mb-12 flex items-center gap-2">
         <Briefcase className="text-blue-600" size={28} />
         <span className="text-2xl font-bold text-gray-900">MyJob</span>
      </div>

      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Email Verification</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          We've sent an verification to <span className="font-semibold text-gray-900">emailaddress@gmail.com</span> to verify your email address and activate your account.
        </p>

        <div className="mb-6">
          <input 
            type="text" 
            placeholder="Verification Code" 
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
          Verify My Account 
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>

        <div className="mt-6 text-sm text-gray-500">
          Didn't receive any code? <button className="text-blue-600 font-medium hover:underline">Resend</button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;