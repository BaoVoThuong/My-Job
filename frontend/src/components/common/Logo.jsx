import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center group-hover:bg-blue-700 transition-colors">
        <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
          <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
        </svg>
      </div>
      <span className="text-2xl font-bold text-gray-900">MyJob</span>
    </Link>
  );
}

