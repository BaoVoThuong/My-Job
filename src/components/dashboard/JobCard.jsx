import { MapPin, DollarSign, Clock, ArrowRight, Bookmark } from '../icons';

export default function JobCard({ job }) {
  const {
    id,
    logo,
    title,
    company,
    location,
    country,
    salary,
    salaryMin,
    salaryMax,
    employmentType,
    daysRemaining,
    isExpired,
    isSaved,
    isFilled
  } = job;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 lg:p-6 hover:border-blue-600 transition-all hover:shadow-sm">
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
        <div className="flex gap-3 sm:gap-4 flex-1 min-w-0 w-full">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
            {logo ? (
              <img src={logo} alt={company} className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
            ) : (
              <span className="text-lg sm:text-xl font-bold text-gray-400">{company?.charAt(0)}</span>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-2.5 truncate">
              <span className="truncate">{title}</span>

              <span className="px-3 sm:px-3.5 py-1 sm:py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full whitespace-nowrap">
                {employmentType}
              </span>
            </h3>

            
            <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-5 gap-y-2 text-xs sm:text-sm text-gray-600 mb-2.5 sm:mb-3.5">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                <span className="truncate">{location}{country && `, ${country}`}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                <span>{salaryMin}-{salaryMax}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                  <span>{daysRemaining} Days Remaining</span>
                </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-4 items-center gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto">
          <button 
            className={`p-2 sm:p-2.5 rounded-lg transition-colors ${
              isSaved 
                ? 'bg-white text-black' 
                : 'border-gray-300 text-gray-600 hover:border-blue-600 hover:text-blue-600'
            }`}
          >
            <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" filled={isFilled}  />
          </button>
          
          {isExpired ? (
            <button 
              disabled 
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-100 text-gray-400 rounded-lg text-xs sm:text-sm font-medium cursor-not-allowed"
            >
              Deadline Expired
            </button>
          ) : (
            <button className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2 group">
              Apply Now
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}