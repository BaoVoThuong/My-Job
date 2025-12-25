import { useState } from 'react';
import { X, Calendar, MapPin, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import { scheduleInterview } from '../../services/candidateService';

const InterviewScheduleModal = ({ application, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    interview_date: '',
    interview_time: '',
    interview_location: '',
    interview_type: 'in-person',
    additional_notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.interview_date || !formData.interview_time || !formData.interview_location) {
        toast.error('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Combine date and time into a single datetime string
      const interviewDateTime = `${formData.interview_date}T${formData.interview_time}`;

      await scheduleInterview(application.id, {
        interview_datetime: interviewDateTime,
        location: formData.interview_location,
        interview_type: formData.interview_type,
        notes: formData.additional_notes,
      });

      toast.success('Interview scheduled successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error scheduling interview:', error);
      toast.error(error.message || 'Error scheduling interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Schedule Interview</h2>
            <p className="text-sm text-gray-600 mt-1">
              For {application.candidate_name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Interview Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interview Type <span className="text-red-500">*</span>
              </label>
              <select
                name="interview_type"
                value={formData.interview_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="in-person">In-Person</option>
                <option value="video">Video Call</option>
                <option value="phone">Phone Call</option>
              </select>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Interview Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="interview_date"
                  value={formData.interview_date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock size={16} className="inline mr-1" />
                  Interview Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="interview_time"
                  value={formData.interview_time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-1" />
                Interview Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="interview_location"
                value={formData.interview_location}
                onChange={handleChange}
                required
                placeholder={
                  formData.interview_type === 'video'
                    ? 'e.g., Zoom Meeting Link, Google Meet'
                    : formData.interview_type === 'phone'
                    ? 'e.g., Phone number or contact details'
                    : 'e.g., Company Office, Meeting Room 3'
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.interview_type === 'video' &&
                  'Provide video call link (Zoom, Google Meet, Teams, etc.)'}
                {formData.interview_type === 'phone' &&
                  'Provide contact number or phone details'}
                {formData.interview_type === 'in-person' &&
                  'Provide physical address or meeting room'}
              </p>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                name="additional_notes"
                value={formData.additional_notes}
                onChange={handleChange}
                rows="4"
                placeholder="Any additional information for the candidate (dress code, what to bring, parking information, etc.)"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Candidate Info Reminder */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Interview Summary</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>
                  <strong>Candidate:</strong> {application.candidate_name}
                </p>
                {application.email && (
                  <p>
                    <strong>Email:</strong> {application.email}
                  </p>
                )}
                {application.phone && (
                  <p>
                    <strong>Phone:</strong> {application.phone}
                  </p>
                )}
              </div>
              <p className="text-xs text-blue-700 mt-3">
                The candidate will receive an email notification with the interview details.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Scheduling...' : 'Schedule Interview'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewScheduleModal;
