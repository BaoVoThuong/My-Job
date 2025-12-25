import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Check } from 'lucide-react';
import {
  getSubscriptionPlans,
  getMySubscription,
  createMoMoPayment,
} from '../../services/paymentService';

const EmployerSubscriptionPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [quota, setQuota] = useState({ total_quota: 0, used_quota: 0, remaining_quota: 0 });
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch plans and current subscription in parallel
      const [plansRes, subRes] = await Promise.all([
        getSubscriptionPlans('employer'),
        getMySubscription(),
      ]);

      if (plansRes.success) {
        setPlans(plansRes.plans);
      }

      if (subRes.success) {
        setQuota(subRes.quota);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (planId) => {
    try {
      setProcessingPayment(true);

      const response = await createMoMoPayment(planId);

      if (response.payUrl) {
        // Redirect to MoMo payment page
        window.location.href = response.payUrl;
      } else {
        toast.error('Failed to create payment');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      toast.error(error?.message || 'Failed to process payment');
      setProcessingPayment(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const PlanCard = ({ plan }) => {
    const isRecommended = plan.max_job_posts === 10;
    const isBestValue = plan.max_job_posts >= 20;
    const pricePerJob = parseFloat(plan.price) / plan.max_job_posts;
    const originalPricePerJob = 100000; // Giá gốc per job
    const originalPrice = originalPricePerJob * plan.max_job_posts;
    const hasDiscount = plan.max_job_posts > 1;

    // Color schemes based on plan
    let colorScheme = {
      gradient: 'from-gray-100 to-gray-200',
      button: 'bg-gray-900 hover:bg-gray-800',
      border: 'border-gray-200',
      iconBg: 'from-gray-100 to-gray-200',
      iconText: 'text-gray-600'
    };

    if (isRecommended) {
      colorScheme = {
        gradient: 'from-blue-100 to-blue-200', 
        button: 'bg-blue-600 hover:bg-blue-700',
        border: 'border-blue-500',
        iconBg: 'from-blue-100 to-blue-200',
        iconText: 'text-blue-600'
      };
    } else if (isBestValue && plan.max_job_posts === 20) {
      colorScheme = {
        gradient: 'from-purple-100 to-purple-200',
        button: 'bg-purple-600 hover:bg-purple-700', 
        border: 'border-purple-500',
        iconBg: 'from-purple-100 to-purple-200',
        iconText: 'text-purple-600'
      };
    } else if (isBestValue && plan.max_job_posts === 50) {
      colorScheme = {
        gradient: 'from-pink-100 to-pink-200',
        button: 'bg-pink-600 hover:bg-pink-700',
        border: 'border-pink-500', 
        iconBg: 'from-pink-100 to-pink-200',
        iconText: 'text-pink-600'
      };
    }

    return (
      <div className={`relative bg-white border-2 rounded-2xl p-6 transition-all hover:shadow-xl hover:scale-105 h-full flex flex-col ${colorScheme.border}`}>
        {/* Top badges */}
        {isRecommended && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
            <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg whitespace-nowrap">
              Most Popular
            </span>
          </div>
        )}

        {isBestValue && plan.max_job_posts === 20 && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
            <span className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg whitespace-nowrap">
              Best Value
            </span>
          </div>
        )}

        {isBestValue && plan.max_job_posts === 50 && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
            <span className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg whitespace-nowrap">
              Best Value
            </span>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${colorScheme.iconBg} rounded-2xl mb-4 shadow-md`}>
            <span className={`text-3xl font-bold ${colorScheme.iconText}`}>{plan.max_job_posts}</span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3">{plan.name}</h3>

          <div className="mb-2">
            {hasDiscount && (
              <div className="text-lg text-gray-500 line-through mb-1">
                {formatPrice(originalPrice)}
              </div>
            )}
            <span className="text-4xl font-bold text-gray-900">
              {formatPrice(plan.price)}
            </span>
          </div>

          <p className="text-gray-500 text-sm font-medium">
            {formatPrice(pricePerJob)} đ per job post
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-6 flex-grow">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
              <Check className="text-green-600" size={14} />
            </div>
            <span className="text-sm text-gray-700 font-medium">
              {plan.max_job_posts} job posting credit{plan.max_job_posts > 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
              <Check className="text-green-600" size={14} />
            </div>
            <span className="text-sm text-gray-700">No expiration date</span>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
              <Check className="text-green-600" size={14} />
            </div>
            <span className="text-sm text-gray-700">Unlimited candidate views</span>
          </div>

          {plan.is_featured_job && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                <Check className="text-green-600" size={14} />
              </div>
              <span className="text-sm text-gray-700 font-medium">Featured job listings</span>
            </div>
          )}

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
              <Check className="text-green-600" size={14} />
            </div>
            <span className="text-sm text-gray-700">Full applicant management</span>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={() => handlePurchase(plan.id)}
          disabled={processingPayment}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all transform hover:scale-105 shadow-lg ${
            processingPayment
              ? 'bg-gray-400 cursor-not-allowed'
              : colorScheme.button
          }`}
        >
          {processingPayment ? 'Processing...' : 'Buy Now'}
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Buy Job Posting Credits
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pay as you go - Buy job posting credits and use them anytime
          </p>
          <p className="text-sm text-gray-500 mt-2">
            1 credit = 1 job post • Credits never expire
          </p>
        </div>

        {/* Current Quota Display */}
        {quota && quota.total_quota > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Job Posting Quota</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Quota:</span>
                <span className="font-semibold text-gray-900">{quota.total_quota}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Used:</span>
                <span className="font-semibold text-gray-900">{quota.used_quota}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Remaining:</span>
                <span className="font-semibold text-blue-600">{quota.remaining_quota}</span>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${(quota.used_quota / quota.total_quota) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/employer/payment-history')}
              className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View Payment History →
            </button>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-12 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
            />
          ))}
        </div>


      </div>
    </div>
  );
};

export default EmployerSubscriptionPage;
