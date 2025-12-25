import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, ArrowRight, Infinity } from 'lucide-react';
import { getMySubscription } from '../../services/paymentService';
import api from '../../services/api';

const CandidatePaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [limits, setLimits] = useState(null);

  useEffect(() => {
    checkPaymentStatus();
  }, []);

  const checkPaymentStatus = async () => {
    try {
      setLoading(true);

      // Get query parameters from MoMo callback
      const orderId = searchParams.get('orderId');
      const resultCode = searchParams.get('resultCode');
      const message = searchParams.get('message');
      const transId = searchParams.get('transId');

      // Check if payment was successful (resultCode = 0 means success in MoMo)
      const isSuccess = resultCode === '0';

      setPaymentStatus({
        success: isSuccess,
        orderId,
        transId,
        message: isSuccess ? 'Payment completed successfully!' : message || 'Payment failed',
      });

      // If successful, simulate payment completion for sandbox
      if (isSuccess && orderId) {
        try {
          // Call simulate API to complete the payment
          await api.post('/payments/momo/simulate-success', { orderId });
          console.log('✅ Payment simulated successfully');

          // Wait a bit for DB to update
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Fetch updated subscription info
          const response = await getMySubscription();
          if (response.success) {
            setLimits(response.limits);
          }
        } catch (simError) {
          console.error('Simulation error:', simError);
          // Still try to fetch limits even if simulation fails
          const response = await getMySubscription();
          if (response.success) {
            setLimits(response.limits);
          }
        }
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setPaymentStatus({
        success: false,
        message: 'Error verifying payment status',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Clock className="text-blue-600 animate-spin" size={32} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Verifying Payment...
          </h2>
          <p className="text-gray-600">Please wait while we confirm your payment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Status Icon */}
          <div className="text-center mb-6">
            {paymentStatus?.success ? (
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <CheckCircle className="text-green-600" size={48} />
              </div>
            ) : (
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                <XCircle className="text-red-600" size={48} />
              </div>
            )}

            <h2 className={`text-2xl font-bold mb-2 ${
              paymentStatus?.success ? 'text-green-600' : 'text-red-600'
            }`}>
              {paymentStatus?.success ? 'Payment Successful!' : 'Payment Failed'}
            </h2>
            <p className="text-gray-600">
              {paymentStatus?.message}
            </p>
          </div>

          {/* Payment Details */}
          {paymentStatus?.orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-semibold text-gray-900">
                  {paymentStatus.orderId}
                </span>
              </div>
              {paymentStatus.transId && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-semibold text-gray-900">
                    {paymentStatus.transId}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Updated Subscription Status (only show if payment successful) */}
          {paymentStatus?.success && limits && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Your Subscription Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Plan Type:</span>
                  <span className="font-bold text-blue-600 text-lg">
                    {limits.isPremium ? '✨ Premium' : 'Free'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Daily Applications:</span>
                  <span className="font-bold text-purple-600 text-lg flex items-center gap-1">
                    {limits.isPremium ? (
                      <>
                        <Infinity size={20} /> Unlimited
                      </>
                    ) : (
                      `${limits.dailyApplies.remaining} remaining today`
                    )}
                  </span>
                </div>
                {limits.isPremium && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <CheckCircle size={16} />
                      <span>Unlimited job applications activated!</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {paymentStatus?.success ? (
              <>
                <button
                  onClick={() => navigate('/find-job')}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Start Applying for Jobs
                  <ArrowRight size={20} />
                </button>
                <button
                  onClick={() => navigate('/candidate/subscription')}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  View Subscription
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/candidate/subscription')}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Try Again
                  <ArrowRight size={20} />
                </button>
                <button
                  onClick={() => navigate('/candidate/dashboard')}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Back to Dashboard
                </button>
              </>
            )}
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Need help? Contact our support team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatePaymentSuccessPage;
