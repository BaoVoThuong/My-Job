import { ChevronDown } from '../icons';

export default function Pagination({ currentPage = 1, totalPages = 5, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronDown className="w-4 h-4 rotate-90" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-xs sm:text-sm font-medium transition-colors ${
            currentPage === page
              ? 'bg-blue-600 text-white'
              : 'border border-gray-300 text-gray-600 hover:border-blue-600 hover:text-blue-600'
          }`}
        >
          {page.toString().padStart(2, '0')}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronDown className="w-4 h-4 -rotate-90" />
      </button>
    </div>
  );
}