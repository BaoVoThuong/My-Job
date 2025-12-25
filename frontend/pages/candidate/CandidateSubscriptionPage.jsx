import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Check, Zap, Infinity, TrendingUp } from 'lucide-react';
import { getSubscriptionPlans, createMoMoPayment, getMySubscription } from '../../services/paymentService';

const CandidateSubscriptionPage = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [limits, setLimits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPlanId, setProcessingPlanId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch candidate plans
      const plansData = await getSubscriptionPlans('candidate');
      setPlans(plansData.plans || []);

      // Fetch current subscription
      const subData = await getMySubscription();
      setCurrentSubscription(subData.subscription);
      setLimits(subData.limits);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyPlan = async (planId) => {
    try {
      setProcessingPlanId(planId);

      const response = await createMoMoPayment(planId);

      if (response.payUrl) {
        // Redirect to MoMo payment page
        window.location.href = response.payUrl;
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      alert('Failed to create payment. Please try again.');
    } finally {
      setProcessingPlanId(null);
    }
  };

  const PlanCard = ({ plan }) => {
    const isCurrentPlan = currentSubscription?.plan_id === plan.id;
    const isFree = plan.price === 0 || plan.price === '0';
    const isRecommended = plan.duration_months === 6;
    const isBestValue = plan.duration_months === 12;

    // Calculate savings compared to 1 month plan
    const monthlyPrice = 50000;
    const totalPrice = parseFloat(plan.price);
    const expectedPrice = monthlyPrice * plan.duration_months;
    const savings = plan.duration_months > 1 ? ((expectedPrice - totalPrice) / expectedPrice * 100).toFixed(0) : 0;

    return (
      <div className={`relative bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl ${
        isRecommended ? 'border-2 border-blue-500 scale-105' : 'border border-gray-200'
      } ${isBestValue ? 'border-2 border-purple-500' : ''}`}>

        {/* Best Value / Recommended Badge */}
        {(isRecommended || isBestValue) && (
          <div className={`absolute top-0 right-0 ${
            isBestValue ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gradient-to-r from-blue-600 to-cyan-600'
          } text-white px-4 py-1 text-xs font-bold rounded-bl-lg flex items-center gap-1`}>
            <Crown size={14} />
            {isBestValue ? 'BEST VALUE' : 'POPULAR'}
          </div>
        )}

        {/* Current Plan Badge */}
        {isCurrentPlan && (
          <div className="absolute top-0 left-0 bg-green-500 text-white px-4 py-1 text-xs font-bold rounded-br-lg">
            CURRENT PLAN
          </div>
        )}

        <div className="p-8">
          {/* Plan Name */}
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>

          {/* Duration */}
          <p className="text-gray-600 mb-4">
            {isFree ? 'Forever' : `${plan.duration_months} ${plan.duration_months === 1 ? 'Month' : 'Months'}`}
          </p>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900">
                {parseFloat(plan.price).toLocaleString('vi-VN')}₫
              </span>
              {!isFree && plan.duration_months > 1 && (
                <span className="text-gray-500 text-sm">
                  ({(totalPrice / plan.duration_months).toLocaleString('vi-VN')}₫/month)
                </span>
              )}
            </div>
            {savings > 0 && (
              <div className="mt-2 inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                <TrendingUp size={14} />
                Save {savings}%
              </div>
            )}
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {isFree ? (
              <>
                <FeatureItem icon={Check} text="20 job applications per day" />
                <FeatureItem icon={Check} text="1 profile" />
                <FeatureItem icon={Check} text="Basic job search" />
                <FeatureItem icon={Check} text="Email notifications" />
              </>
            ) : (
              <>
                <FeatureItem icon={Infinity} text="Unlimited job applications" highlight />
                <FeatureItem icon={Infinity} text="Unlimited profiles" highlight />
                <FeatureItem icon={Zap} text="Priority in search results" />
                <FeatureItem icon={Check} text="Advanced job alerts" />
                <FeatureItem icon={Check} text="Resume download tracking" />
                <FeatureItem icon={Crown} text="Premium badge on profile" />
              </>
            )}
          </div>

          {/* CTA Button */}
          {isFree ? (
            <button
              disabled
              className="w-full bg-gray-300 text-gray-600 py-3 rounded-lg font-semibold cursor-not-allowed"
            >
              Current Plan
            </button>
          ) : isCurrentPlan ? (
            <button
              disabled
              className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold cursor-not-allowed"
            >
              Active
            </button>
          ) : (
            <button
              onClick={() => handleBuyPlan(plan.id)}
              disabled={processingPlanId !== null}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                isRecommended || isBestValue
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {processingPlanId === plan.id ? 'Processing...' : 'Upgrade Now'}
            </button>
          )}
        </div>
      </div>
    );
  };

  const FeatureItem = ({ icon: Icon, text, highlight }) => (
    <div className={`flex items-center gap-3 ${highlight ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
      <Icon size={20} className={highlight ? 'text-blue-600' : 'text-green-500'} />
      <span>{text}</span>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upgrade to Premium
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get unlimited job applications and stand out from the crowd with our premium features
          </p>
        </div>

        {/* Current Status Card */}
        {limits && (
          <div className="max-w-2xl mx-auto mb-12 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Current Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Plan Type</p>
                <p className="text-xl font-bold text-blue-600">
                  {limits.isPremium ? 'Premium' : 'Free'}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Daily Applications</p>
                <p className="text-xl font-bold text-purple-600">
                  {limits.isPremium ? (
                    <span className="flex items-center gap-1">
                      <Infinity size={24} /> Unlimited
                    </span>
                  ) : (
                    `${limits.dailyApplies.current} / ${limits.dailyApplies.limit} today`
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {plans.filter(p => p.price > 0).map(plan => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Benefits Section */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6 text-center">Why Go Premium?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="bg-white/20 rounded-lg p-2">
                <Infinity className="text-white" size={24} />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Unlimited Applications</h4>
                <p className="text-blue-100 text-sm">Apply to as many jobs as you want, no daily limits</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white/20 rounded-lg p-2">
                <Crown className="text-white" size={24} />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Stand Out</h4>
                <p className="text-blue-100 text-sm">Get a premium badge that makes you more visible to employers</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white/20 rounded-lg p-2">
                <Zap className="text-white" size={24} />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Priority Listing</h4>
                <p className="text-blue-100 text-sm">Appear higher in employer searches</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white/20 rounded-lg p-2">
                <Check className="text-white" size={24} />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Advanced Features</h4>
                <p className="text-blue-100 text-sm">Track who viewed your profile and downloaded your resume</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-12 text-center text-gray-600">
          <p>All plans include a 100% money-back guarantee within 7 days</p>
          <p className="mt-2">Need help? <button className="text-blue-600 hover:underline">Contact Support</button></p>
        </div>

      </div>
    </div>
  );
};

export default CandidateSubscriptionPage;
